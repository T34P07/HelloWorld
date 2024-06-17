import { CameraConfigType } from "client/types/config_types/CameraConfigType";

const CameraConfig: CameraConfigType = {
	Modes: [
		{
			Responsiveness: -1,
			OffsetResponsiveness: 10,
			SubModes: [
				{
					Offset: new Vector3(0, 0, -1),
				},
			],
		},
		{
			Responsiveness: -1,
			OffsetResponsiveness: 10,
			SubModes: [
				{
					Offset: new Vector3(2, 1, -4),
				},
				{
					Offset: new Vector3(-2, 1, -4),
				},
			],
		},
		{
			Responsiveness: -1,
			OffsetResponsiveness: 10,
			SubModes: [
				{
					Offset: new Vector3(0, 0, -6),
				},
			],
		},
	],
	FOV: 80,
	Clamp: math.rad(80),
};

export default CameraConfig;
