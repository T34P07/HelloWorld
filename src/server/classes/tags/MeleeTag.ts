import { WeaponTag } from "./WeaponTag";

export class MeleeTag extends WeaponTag {
	constructor(instance: Instance, tagClass: string) {
		super(instance, tagClass);
	}

	Hit(humanoids: Humanoid[]) {
		super.Hit(humanoids);
	}

	Destroy() { }
}
