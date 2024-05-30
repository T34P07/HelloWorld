import { CameraConfigType } from "shared/types/ConfigTypes";

const CameraConfig: CameraConfigType = {
	Modes: [
		{
			Offset: new Vector3(0, 0, 1),
			Responsiveness: -1,
		},

		{
			Offset: new Vector3(2, 1, 4),
			Responsiveness: -1,
		},

		{
			Offset: new Vector3(0, 0, 6),
			Responsiveness: -1,
		},
	],
	FOV: 120,
	Clamp: math.rad(80),
};

export default CameraConfig;