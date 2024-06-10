import { WeaponTag } from "./WeaponTag";

export class MeleeTag extends WeaponTag {
	constructor(instance: Instance, toolclass: string) {
		super(instance, toolclass);
	}

	Destroy() {}
}
