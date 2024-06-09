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
