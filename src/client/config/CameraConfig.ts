import { CameraConfigType } from "shared/types/ConfigTypes";

const CameraConfig: CameraConfigType = {
	Modes: {
		1: {
			Offset: new Vector3(0, 0, 1),
			Responsiveness: -1,
		},

		2: {
			Offset: new Vector3(2, 1, 4),
			Responsiveness: 20,
		},

		3: {
			Offset: new Vector3(0, 0, 6),
			Responsiveness: -1,
		},
	},
};

export default CameraConfig;
