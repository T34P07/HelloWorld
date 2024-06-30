import KatanaConfig from "shared/config/tools/weapons/KatanaConfig";
import { MeleeTag } from "./MeleeTag";

export class KatanaTag extends MeleeTag {
	constructor(instance: Instance, tagClass: string) {
		super(instance, tagClass);
		this.config = KatanaConfig;
	}

	Hit(humanoids: Humanoid[]) {
		super.Hit(humanoids);
	}

	Destroy() { }
}
