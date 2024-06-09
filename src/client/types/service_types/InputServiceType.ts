export type InputActionCallback = (name: string, userInputState: Enum.UserInputState, inputObject: InputObject) => void;

export type InputServiceType = {
	Actions: Record<string, InputActionCallback>;
	BindAction: (name: string, callback: InputActionCallback) => void;
	OnInputBegan: (inputObject: InputObject, gameProcessedEvent: boolean) => void;
	OnInputEnded: (inputObject: InputObject, gameProcessedEvent: boolean) => void;
	IsInputActive: (name: string) => boolean;
	Start: () => void;
};
