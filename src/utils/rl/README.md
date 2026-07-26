# RL Lab — in-browser PPO

Internal notes for the reinforcement-learning demo at `/playground` (Demo 02).
A planar quadrotor learns to hover from scratch, in the visitor's browser, in
roughly a minute. Everything here is hand-written: no ML framework, no
pre-trained weights, nothing fetched at runtime.

The demo exists to signal *depth* for specialised RL roles. The task itself is
deliberately easy — the signal is the implementation, the diagnostics panel,
and the two failure modes documented below, not task difficulty.

---

## File map

| File | Responsibility |
|---|---|
| `env.js` | Planar quadrotor dynamics, reward, termination, domain randomization, cursor disturbance. Pure. |
| `nn.js` | MLP with manual forward/backward, Adam, global-norm gradient clipping. Pure. |
| `ppo.js` | Gaussian policy likelihood/entropy, GAE(λ), clipped surrogate + its gradient, diagnostics. Pure. |
| `trainer.js` | Glues the above into rollout → update. Owns return normalization. |
| `trainWorker.js` | Runs the training loop off the main thread; posts stats + a policy snapshot per iteration. |
| `../../components/playground/rlLab.jsx` | UI: canvas sim, diagnostics charts, hyperparameter sliders. |
| `../../components/playground/sparkline.jsx` | Tiny canvas line chart. |

**Why the worker split.** One PPO iteration takes ~200 ms. Inline, that
freezes the page ~5×/second. The worker owns the trainer and posts a snapshot
of the *policy only* (~4.8k floats) after each iteration; the main thread runs
its own `env` instance at 60 fps against that snapshot.

### Training env vs evaluation env — read this before changing the UI

There are **two independent environments**, and conflating them would quietly
invalidate the whole sim2real demo:

| | Training env | Evaluation env (what you see) |
|---|---|---|
| Lives in | worker, inside `createTrainer` | main thread, `vizRef` in `rlLab.jsx` |
| Actions | **sampled** from the policy distribution | **greedy** (distribution mean) |
| Domain randomization | per the UI toggle | always off |
| Cursor disturbance | **never** | yes |
| Feeds gradients | yes | no |

The worker's message API is deliberately narrow — `reset | start | pause |
setHP`. There is no channel by which a cursor disturbance could reach training,
and that is intentional: the gust must stay out-of-distribution or the
"randomize and it survives" contrast is meaningless.

This is stated on the canvas ("Evaluation view — …") and in the methods note on
the page, because it is the first thing an RL-literate visitor asks. If you
ever *do* want user-injected disturbances in training, add an explicit message
type and label it in the UI — don't quietly wire `setDisturbance` into the
worker.

---

## Environment

State `[x, y, vx, vy, θ, ω]`, observation is 7-dim and goal-relative
(`sin θ`/`cos θ` rather than raw angle). Action is 2-dim continuous: one thrust
per rotor, mapped `[-1,1] → [0, maxThrust]`, so **`a = 0` is a hover command**.
Differential thrust produces torque, so the agent must tilt to translate — this
is a real control problem, not a point mass with a velocity command.

### Physics constants are not arbitrary

The attitude timescale must be learnable at the control rate. Time to flip past
`maxTilt` under full differential thrust:

```
α_max = maxThrust · arm / I     t_flip = sqrt(2 · maxTilt / α_max)
```

| `I` | `dt` | α_max | steps to flip |
|---|---|---|---|
| 0.02 | 0.04 (25 Hz) | 73.6 rad/s² | **4.7** ← original; unlearnable |
| 0.10 | 0.03 (33 Hz) | 14.7 rad/s² | 14.0 ← current |

At ~5 steps to flip the agent cannot recover from its own exploration noise and
never learns attitude control. If you change `arm`, `maxThrust`, `inertia` or
`dt`, re-check this ratio.

### Reward — and the bug that shaped it

Current reward is a sum of **bounded, non-negative** terms:

```
2.0·exp(-0.8·d²)  +  0.6·exp(-3·θ²)  +  0.4·exp(-0.5·v²)  -  0.02·|ω|  -  0.005·‖a‖²
```

The first version used linear penalties (`1.0 - 0.9·d - …`). That makes
per-step reward **negative** beyond d ≈ 1.1. Because a crash merely *ends* the
episode, dying immediately became the optimal policy — living at d = 2 cost
−0.94/step, so ~6 steps of survival already outweighed the one-off −5 crash
penalty.

Observed symptom: return "improving" (−57 → −9.7) and distance shrinking, while
**episode length fell 80 → 19** and crash rate stayed pinned at 100%. The agent
was learning to crash *better*.

> **Invariant:** keep per-step reward ≥ 0 (or at least strictly greater than the
> value of terminating). If you add a penalty term, check `reward()` over the
> reachable state space before assuming a training failure is a hyperparameter
> problem.

Crash penalty is −10 and terminates. Truncation at `maxSteps` is *not* a crash.

### Domain randomization

Per-episode resampling of mass (0.75–1.35×), thrust authority (0.85–1.15×),
constant wind, actuator latency (0–2 steps, via an action queue) and Gaussian
observation noise. Off by default; toggling it in the UI **resets training**,
because it changes the distribution the rollout is drawn from.

`setDisturbance()` is separate from wind on purpose: it is the *run-time*
cursor gust, deliberately outside the training distribution, so the sim2real
contrast is honest.

---

## PPO details

Standard clipped-surrogate PPO. Things worth knowing:

- **Truncation vs termination.** `nextValues[t]` is `0` on a crash and
  `V(s_final)` on a time-limit. Conflating them teaches the agent that running
  out of clock is as bad as falling out of the sky. `computeGAE` takes
  `nextValues` pre-resolved precisely so this decision is explicit and testable.
- **Clipping asymmetry.** The gradient is zeroed only when the clip *binds*
  against the direction of improvement. Moving the ratio the wrong way (e.g.
  ratio > 1+ε with negative advantage) must still produce gradient. There is a
  test for this; it is the easiest part of PPO to get subtly wrong.
- **approx-KL** uses Schulman's k3 estimator (`exp(r) - 1 - r`), which is
  non-negative and low-variance, so it can be compared against a target.
- **Early stopping.** The epoch loop bails if approx-KL exceeds `1.5 × targetKL`.
- **log-std** is a free parameter vector (not state-dependent), clamped to
  `[-3, 0.5]`, updated with its own small Adam.

### Return normalization — and the second bug

Discounted returns here reach ~250 (per-step ≈ 3.0, γ = 0.99, 300 steps). A
freshly-initialised linear head starts near 0, and at lr = 3e-4 across ~1.4k
Adam steps it simply cannot travel that far.

Measured before the fix: **V(s₀) ≈ 33 against a true discounted return of
≈ 232** — a 7× underfit, with explained variance sitting at 0.00. It was easy to
mistake this for the benign "EV degenerates when returns are near-constant"
artifact. It was not benign.

The critic now regresses **normalized** targets `(R − μ)/σ`, with `μ, σ` from a
running estimator (Chan parallel-variance update, count capped at 20k so it
keeps adapting as returns grow). `valueOf()` denormalizes on the way out, so
GAE still operates in reward units.

After: V(s₀) ≈ 250 vs actual ≈ 250, EV ≈ 0.4–0.65, and learning is *faster*
(better advantages).

> **Invariant:** if you change the reward scale, γ, or episode length, the value
> targets change scale too. `trainer.test.js` has a calibration test that will
> catch a regression here.

---

## Reading the diagnostics

What the panel is for — and what "bad" looks like:

| Metric | Healthy | Bad, and what it means |
|---|---|---|
| Episode return | rising, then plateau | flat at floor → not learning; collapse → update blew up |
| Policy entropy | slow decline | crashes to floor early → premature convergence (entropy coef too low); flat high → never commits |
| approx-KL | ~1e-3 – 1e-2 | spikes ≫ targetKL → step too large, outside trust region |
| Clip fraction | ~0.02 – 0.2 | saturating near 1 → nearly every sample clipped, lr far too high |
| Explained variance | > 0.3 | ~0 → critic underfit (see above) or returns genuinely constant; < 0 → worse than predicting the mean |

The sliders exist so a visitor can *induce* each failure. Pushing lr to 1e-2 is
the clearest demo: KL spikes, clip fraction saturates, return collapses.

---

## Tests

`npx vitest run src/utils/rl/` — 28 tests.

- **`nn.test.js`** — the load-bearing one is a **finite-difference gradient
  check** over every layer's weights and biases (central differences, h = 1e-6,
  Float64 throughout precisely so this is meaningful). If backprop is wrong
  anywhere, this fails. Also: tanh bounding, and that Adam actually descends.
- **`ppo.test.js`** — closed-form Gaussian log-prob/entropy; GAE reduces to
  Monte-Carlo at λ=1 and to one-step TD at λ=0; credit does not leak across
  episode boundaries; bootstrap-through-truncation vs terminal; all four
  quadrants of the clipping asymmetry; diagnostics edge cases.
- **`trainer.test.js`** — end-to-end convergence, seed reproducibility, that a
  diverging lr produces measurably higher KL, and critic calibration.

⚠️ `trainer.test.js` takes **~40 s** and dominates the suite runtime. It trains
real agents; that is the point. If it becomes annoying in CI, reduce iterations
rather than deleting it — a convergence test is the only thing standing between
"the maths is right" and "the thing actually learns".

---

## Performance

- ~200 ms per iteration (1024 steps rollout, 4 epochs, 256 minibatch, 64×64
  nets) → ~4–5 iterations/sec in the worker.
- Converges to 0% crash rate around iteration 70 (~70k env steps, ~15 s), and
  plateaus near return 830 by iteration ~150.
- Float64 throughout. Float32 would be marginally faster but makes the gradient
  check meaningless; at these sizes the arithmetic is not the bottleneck.

---

## Known limitations

- 2D, dense reward, single task. Chosen so it converges in a minute of JS.
- Value and policy are separate networks (no shared trunk).
- No observation normalization — the observation is hand-scaled in `observe()`.
  Fine here; would need a running normalizer for a harder task.
- The visualisation env always runs **non-randomized** so the cursor gust is the
  only disturbance the viewer sees. Training randomization is independent.
- Hyperparameters that change tensor shapes or rollout layout (`hidden`,
  `rolloutSteps`, `minibatch`) are not live-tunable and require a reset; the UI
  only exposes the live-safe ones.

## Possible extensions

- Reward-hacking playground: let the visitor write a reward and watch the agent
  specification-game it (pairs naturally with the reward bug above).
- Side-by-side policies: nominal vs domain-randomized, same disturbance.
- A second task (waypoint chase, wind corridor) to show generalisation.
- Save/load trained weights so the page can open with a converged policy and
  train on demand.
