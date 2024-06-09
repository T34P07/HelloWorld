export type InputCode = Enum.KeyCode | Enum.UserInputType;

export type InputConfigType = {
	[name: string]: InputCode;
};
