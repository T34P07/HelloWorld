import { MeleeTag } from "./MeleeTag";

export class KatantaTag extends MeleeTag {
	constructor(tool: Tool, toolclass: string) {
		super(tool, toolclass);

		print("new katana", tool, toolclass);
	}

	Destroy() {}
}
