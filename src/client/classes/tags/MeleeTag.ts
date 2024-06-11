import InputService from "client/services/InputService";
import { WeaponTag } from "./WeaponTag";

export class MeleeTag extends WeaponTag {
	private Attack() {
		this.actionAnimator!.PlayAnimation(`Attack${os.time() % 2 ? 1 : 2}`);
	}

	constructor(instance: Instance, toolclass: string) {
		super(instance, toolclass);

		this.janitor.Add(
			 => {
				this.Activated();
			}),
		);
	}

	Destroy() {
		super.Destroy();
	}
}
