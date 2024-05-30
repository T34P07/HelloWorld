import { InputActionCallback, InputServiceType } from "shared/types/ServiceType";
import InputConfig from "./config/InputConfig";

const UserInputService = game.GetService("UserInputService");

const InputService: InputServiceType = {
	Actions: {},
	BindAction: (name: string, callback: InputActionCallback) => {
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
	Start: () => {
		UserInputService.InputBegan.Connect(InputService.OnInputBegan);
		UserInputService.InputEnded.Connect(InputService.OnInputEnded);
	},
};

export default InputService;
