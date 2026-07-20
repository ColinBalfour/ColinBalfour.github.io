import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// App declares only <Routes>; the Router lives in index.jsx (HashRouter).
// Tests supply their own MemoryRouter so the routes resolve.
test("renders the homepage with navigation", () => {
	render(
		<MemoryRouter initialEntries={["/"]}>
			<App />
		</MemoryRouter>
	);
	// Nav links (Home may also appear in the footer, so allow multiple).
	expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
	expect(screen.getByText("Publications")).toBeInTheDocument();
	// Homepage renders the intro copy from INFO.homepage.description.
	expect(screen.getByText(/I'm Colin Balfour/i)).toBeInTheDocument();
});
