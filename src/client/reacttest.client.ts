import ReactRoblox from "@rbxts/react-roblox";
import WeaponUI from "./ui/WeaponsUI";
import { Players } from "@rbxts/services";
import React, { ReactElement } from "@rbxts/react";

const localPlayer = Players.LocalPlayer;
const PlayerGui = localPlayer.WaitForChild("PlayerGui");

const ui = WeaponUI.Start();

const MyTestFrame = () => {
	return React.createElement("Frame", {
		Size: new UDim2(0, 100, 0, 100),
		BackgroundTransparency: 0.5,
	});
};

const handle = new Instance("ScreenGui", PlayerGui);
const root = ReactRoblox.createRoot(handle);

const MainFrame = (props: { Content: ReactElement }) => {
	return React.createElement(
		"Frame",
		{
			Size: UDim2.fromScale(0.5, 0.5),
			Position: UDim2.fromScale(0.5, 0.5),
			AnchorPoint: Vector2.one.mul(0.5),
			BorderSizePixel: 0,
			BackgroundColor3: new Color3(0.1, 0.1, 0.1),
		},
		props,
	);
};

const Panel1 = () => {
	return React.createElement(
		"Frame",
		{
			Size: UDim2.fromScale(0.5, 0.5),
			Position: UDim2.fromScale(0.5, 0.5),
			AnchorPoint: Vector2.one.mul(0.5),
			BorderSizePixel: 0,
			BackgroundColor3: new Color3(0.2, 0.2, 0.2),
		},
		{
			TextLabel: React.createElement("TextLabel", {
				Size: UDim2.fromScale(1, 1),
				Position: UDim2.fromScale(0.5, 0.5),
				AnchorPoint: Vector2.one.mul(0.5),
				TextScaled: true,
				Text: "This is frame 1",
			}),
		},
	);
};

const Panel2 = () => {
	return React.createElement(
		"Frame",
		{
			Size: UDim2.fromScale(0.5, 0.5),
			Position: UDim2.fromScale(0.5, 0.5),
			AnchorPoint: Vector2.one.mul(0.5),
			BorderSizePixel: 0,
			BackgroundColor3: new Color3(0.2, 0.2, 0.2),
		},
		{
			TextLabel: React.createElement("TextLabel", {
				Size: UDim2.fromScale(1, 1),
				Position: UDim2.fromScale(0.5, 0.5),
				AnchorPoint: Vector2.one.mul(0.5),
				TextScaled: true,
				Text: "This is frame 2",
			}),
		},
	);
};

root.render(
	React.createElement(MainFrame, {
		Content: Panel1(),
	}),
);
