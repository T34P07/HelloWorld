import { Tag } from "./Tag";

export class ToolTag extends Tag {
	private tool;
	constructor(tool: Tool) {
		super();
		this.tool = tool;
		print("new tool", tool);
	}

	Destroy() {
		print("remove tool", this.tool);
	}
}
