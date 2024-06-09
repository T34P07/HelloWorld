import { MeleeTag } from "./MeleeTag";

export class KatanaTag extends MeleeTag {
	constructor(tool: Tool, toolclass: string) {
		super(tool, toolclass);
	}

	Destroy() {}
}
