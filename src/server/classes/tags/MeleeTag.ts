import { WeaponTag } from "./WeaponTag";

export class MeleeTag extends WeaponTag {
	constructor(tool: Tool, toolclass: string) {
		super(tool, toolclass);
	}

	Destroy() {}
}
