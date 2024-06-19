import AttachToRig from "shared/utilities/AttachToRig";
import { Tag } from "./Tag";

export class ToolTag extends Tag {
	protected tool: Tool;
	protected class: string;
	private rig;

	constructor(tool: Tool, toolclass: string) {
		super();
		this.tool = tool;
		this.class = toolclass;
		this.rig = this.tool.Parent as Model;
		AttachToRig(this.tool, this.rig, "Character");
	}

	Destroy() {}
}
