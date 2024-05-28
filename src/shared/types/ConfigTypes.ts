type CameraMode = {
	Offset: Vector3;
	Responsiveness: number;
};

export type CameraConfigType = {
	Modes: {
		[key: number]: CameraMode;
	};
};
