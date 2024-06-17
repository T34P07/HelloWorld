import { InputServiceType } from "client/types/service_types/InputServiceType";
import InputConfig from "../config/InputConfig";
import { Signal } from "@rbxts/beacon";

const UserInputService = game.GetService("UserInputService");

const InputService: InputServiceType = {
	Actions: {},
	BindAction: (name) => {
		InputService.Actions[name] = new Signal();
		return InputService.Actions[name];
	},
	UnbindAction: (name) => {
		const signal = InputService.Actions[name];
		if (signal) signal.Destroy();
	},
	OnInputBegan: (inputObject, gameProcessedEvent) => {
		if (gameProcessedEvent) return;

		for (const [actionName, inputCode] of pairs(InputConfig)) {
			if (inputObject.KeyCode === inputCode || inputObject.UserInputType === inputCode) {
				const signal = InputService.Actions[actionName];
				if (!signal) continue;

				signal.Fire(tostring(actionName), Enum.UserInputState.Begin, inputObject);
			}
		}
	},
	OnInputEnded: (inputObject, gameProcessedEvent) => {
		if (gameProcessedEvent) return;

		for (const [actionName, inputCode] of pairs(InputConfig)) {
			if (inputObject.KeyCode === inputCode || inputObject.UserInputType === inputCode) {
				const signal = InputService.Actions[actionName];
				if (!signal) continue;

				signal.Fire(tostring(actionName), Enum.UserInputState.End, inputObject);
			}
		}
	},
	IsInputActive: (name) => {
		const input = InputConfig[name];

		if (input.IsA("UserInputType")) return UserInputService.IsMouseButtonPressed(input);
		if (input.IsA("KeyCode")) return UserInputService.IsKeyDown(input);

		return false;
	},
	Start: () => {
		UserInputService.InputBegan.Connect(InputService.OnInputBegan);
		UserInputService.InputEnded.Connect(InputService.OnInputEnded);
	},
};

export default InputService;
