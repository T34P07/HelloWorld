import { ToolTag } from "./ToolTag";

export class WeaponTag extends ToolTag {
	constructor(tool: Tool, toolclass: string) {
		super(tool, toolclass);
		print(this.tool, this.class);

		//const animations = Prefabs.Animations.Tools.FindFirstChild
	}

	Destroy() {}
}
