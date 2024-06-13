import InputService from "client/services/InputService";
import { WeaponTag } from "./WeaponTag";
import { Trove } from "@rbxts/trove";
import { RunService, Workspace } from "@rbxts/services";
import CharacterService from "client/services/CharacterService";

export class MeleeTag extends WeaponTag {
	private collider: BasePart | undefined;
	private humanoidsHit: Humanoid[] = [];

	private DetectHit(dt: number) {
		if (!this.collider) return;

		const parts = Workspace.GetPartsInPart(this.collider, CharacterService.noCharOverlapParams);

		parts.forEach((instance: Instance) => {
			const humanoid = (instance.Parent!.FindFirstChild("Humanoid") ??
				instance.Parent!.Parent!.FindFirstChild("Humanoid")) as Humanoid;
			if (!humanoid) return;

			if (!this.humanoidsHit.includes(humanoid)) {
				this.humanoidsHit.push(humanoid);
			}
		});

		this.collider.Color = parts.size() > 0 ? new Color3(0, 1, 0) : new Color3(1, 0, 0);
	}

	private Attack() {
		const animationTrack = this.actionAnimator!.GetAnimationTrack(`Attack`);
		if (!animationTrack) return;

		this.humanoidsHit = [];

		const trove = new Trove();

		trove.add(
			animationTrack.GetMarkerReachedSignal("Hit").Connect((state?: string) => {
				if (!state) return;

				if (state === "Began") {
					trove.add(
						RunService.Heartbeat.Connect((dt: number) => {
							this.DetectHit(dt);
						}),
					);
				} else {
					if (trove) trove.destroy();
				}
			}),
		);

		animationTrack.Ended.Once(() => {
			if (trove) trove.destroy();
		});

		animationTrack.Play(0.25);
	}

	constructor(instance: Instance, toolclass: string) {
		super(instance, toolclass);
		this.collider = this.instance.FindFirstChild("Collider", true) as BasePart;

		this.trove.add(
			(this.instance as Tool).Activated.Connect(() => {
				this.Attack();
			}),
		);
	}

	Destroy() {
		super.Destroy();
	}
}
