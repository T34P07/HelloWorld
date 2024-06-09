import { Tag } from "./Tag";

export class ToolTag extends Tag {
	private tool;
	private rig;

	AttachToRig() {
		this.tool.GetDescendants().forEach((motor6D) => {
			if (!motor6D.IsA("Motor6D") || !motor6D.HasTag("RigAttach")) return;

			const RigPartName = motor6D.GetAttribute("RigPart") as string | undefined;
			if (!RigPartName) return;

			const RigPart = this.rig!.FindFirstChild(RigPartName) as BasePart;
			if (!RigPart) return;

			motor6D.Part0 = motor6D.Part0 !== undefined ? motor6D.Part0 : RigPart;
			motor6D.Part1 = motor6D.Part1 !== undefined ? motor6D.Part1 : RigPart;
		});
	}

	constructor(tool: Tool) {
		super();
		this.tool = tool;
		this.rig = this.tool.Parent;
		this.AttachToRig();
	}

	Destroy() {
		print("remove tool", this.tool);
	}
}
