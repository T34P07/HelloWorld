import { MeleeConfigType } from "shared/types/tools/weapons/MeleeConfigType";
import { ToolTag } from "./ToolTag";
import MeleeConfig from "shared/config/tools/weapons/MeleeConfig";
export class WeaponTag extends ToolTag {
	protected config: MeleeConfigType = MeleeConfig;

	constructor(instance: Instance, tagClass: string) {
		super(instance, tagClass);
	};

	public Hit(humanoids: Humanoid[]) {
		humanoids.forEach((humanoid) => {
			humanoid.TakeDamage(this.config.Damage);
		});
	};

	Destroy() { }
}
