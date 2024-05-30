type CameraMode = {
	Offset: Vector3;
	Responsiveness: number;
};

export type CameraConfigType = {
	Modes: [CameraMode, CameraMode, CameraMode];
	FOV: number;
};

export type InputCode = Enum.KeyCode | Enum.UserInputType;

export type InputConfigType = {
	[name: string]: InputCode;
};
