import { ToolTag } from "./ToolTag";

export class WeaponTag extends ToolTag {
	constructor(tool: Tool, toolclass: string) {
		super(tool, toolclass);
	}

	Destroy() {}
}
