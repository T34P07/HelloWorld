type CameraSubMode = {
	Offset: Vector3;
};

type CameraMode = {
	Responsiveness: number;
	OffsetResponsiveness: number;
	SubModes: CameraSubMode[];
};

export type CameraConfigType = {
	Modes: CameraMode[];
	FOV: number;
	Clamp: number;
};

export type InputCode = Enum.KeyCode | Enum.UserInputType;

export type InputConfigType = {
	[name: string]: InputCode;
};

export type CharacterTiltConfigType = {
	Factor: Vector2;
	Responsiveness: number;
};
