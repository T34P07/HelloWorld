export type CharacterNodeInputType = {
	hrp: { instance: Part; cf: CFrame };
	rootJoint: { instance: Motor6D; c0: CFrame; c1: CFrame };
};

export type CameraNodeInputType = {
	camera: { instance: Camera; cf: CFrame };
};
