import { InputActionCallback, InputServiceType } from "client/types/ServiceType";
import InputConfig from "../config/InputConfig";

const UserInputService = game.GetService("UserInputService");

const InputService: InputServiceType = {
	Actions: {},
	BindAction: (name, callback) => {
		InputService.Actions[name] = callback;
	},
	OnInputBegan: (inputObject, gameProcessedEvent) => {
		if (gameProcessedEvent) return;

		for (const [actionName, inputCode] of pairs(InputConfig)) {
			if (inputObject.KeyCode === inputCode) {
				const callback = InputService.Actions[actionName];
				if (!callback) continue;

				callback(tostring(actionName), Enum.UserInputState.Begin, inputObject);
			}
		}
	},
	OnInputEnded: (inputObject, gameProcessedEvent) => {
		if (gameProcessedEvent) return;

		for (const [actionName, inputCode] of pairs(InputConfig)) {
			if (inputObject.KeyCode === inputCode) {
				const callback = InputService.Actions[actionName];
				if (!callback) continue;

				callback(tostring(actionName), Enum.UserInputState.End, inputObject);
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
