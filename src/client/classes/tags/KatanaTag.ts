import { MeleeTag } from "./MeleeTag";

export class KatanaTag extends MeleeTag {
	constructor(instance: Instance, toolclass: string) {
		super(instance, toolclass);
	}

	Destroy() {}
}
