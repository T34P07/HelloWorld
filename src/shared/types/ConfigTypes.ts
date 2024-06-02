type CameraMode = {
	Offset: Vector3;
	Responsiveness: number;
	OffsetResponsiveness: number;
	Submodes: [];
};

export type CameraConfigType = {
	Modes: [CameraMode, CameraMode, CameraMode];
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
