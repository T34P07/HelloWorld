import { ToolTag } from "./ToolTag";

export class WeaponTag extends ToolTag {
	constructor(instance: Instance, toolclass: string) {
		super(instance, toolclass);
	}

	protected Attack() { }

	protected Equipped(): boolean {
		if (!super.Equipped()) return false;

		return true;
	}

	protected Unequipped(): void {
		super.Unequipped();
	}

	Destroy() {
		super.Destroy();
	}
}
