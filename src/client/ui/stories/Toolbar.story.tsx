import React, { useState } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";

const localPlayer = Players.LocalPlayer;
const PlayerGui = localPlayer.WaitForChild("PlayerGui") as PlayerGui;

function Toast() {
	const [count, setCount] = useState(0);

	return (
		<textbutton
			Size={new UDim2(0, 100 + count * 2, 0, 100 + count * 2)}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Text={`Count: ${count}`}
			Event={{ Activated: () => setCount(count + 1) }}
		/>
	);
}

export = (target: UIBase) => {
	const handle = new Instance("ScreenGui", PlayerGui);
	const root = ReactRoblox.createRoot(handle);

	root.render(React.createElement(Toast));
	return () => root.unmount();
};
