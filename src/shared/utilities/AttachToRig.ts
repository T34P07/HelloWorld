type RigType = "Character" | "Viewmodel";

const AttachToRig = (instance: Instance, rig: Model, rigType: RigType) => {
	instance.GetDescendants().forEach((motor6D) => {
		if (!motor6D.IsA("Motor6D") || !motor6D.HasTag("RigAttach")) return;

		const RigPartName = motor6D.GetAttribute(`${rigType}Part`) as string | undefined;
		if (!RigPartName) return;

		const RigPart = rig.FindFirstChild(RigPartName) as BasePart;
		if (!RigPart) return;

		motor6D.Part0 = motor6D.Part0 !== undefined ? motor6D.Part0 : RigPart;
		motor6D.Part1 = motor6D.Part1 !== undefined ? motor6D.Part1 : RigPart;
		motor6D.C0 = motor6D.GetAttribute(`${rigType}C0`) as CFrame;
		motor6D.C1 = motor6D.GetAttribute(`${rigType}C1`) as CFrame;
	});
};

export default AttachToRig;
