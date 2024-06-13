import { Signal } from "@rbxts/beacon";

export type InputCallbackType = [string, Enum.UserInputState, InputObject];

export type InputServiceType = {
	Actions: Record<string, Signal<InputCallbackType>>;
	BindAction: (name: string) => Signal<InputCallbackType>;
	UnbindAction: (name: string) => void;
	OnInputBegan: (inputObject: InputObject, gameProcessedEvent: boolean) => void;
	OnInputEnded: (inputObject: InputObject, gameProcessedEvent: boolean) => void;
	IsInputActive: (name: string) => boolean;
	Start: () => void;
};
