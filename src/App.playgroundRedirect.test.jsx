import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { expect, test } from "vitest";

import App from "./App";

// The /playground page was removed; old shared links should still land on
// the event camera demo, now embedded on the homepage.
function LocationProbe() {
	const location = useLocation();
	return (
		<div data-testid="location-probe">
			{location.pathname}
			{location.hash}
		</div>
	);
}

test("/playground redirects to the homepage event-camera section", () => {
	render(
		<MemoryRouter initialEntries={["/playground"]}>
			<LocationProbe />
			<App />
		</MemoryRouter>
	);

	expect(screen.getByTestId("location-probe")).toHaveTextContent(
		"/#event-camera"
	);
});
