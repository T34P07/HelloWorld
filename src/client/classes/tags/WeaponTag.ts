import { ToolTag } from "./ToolTag";

export class WeaponTag extends ToolTag {
	constructor(instance: Instance, toolclass: string) {
		super(instance, toolclass);
	}

	Destroy() {
		super.Destroy();
	}
}
