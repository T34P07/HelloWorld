import Prefabs from "shared/libraries/Prefabs";
import { Tag } from "./Tag";
import CharacterService from "client/services/CharacterService";
import { ActionAnimator } from "client/services/ActionAnimator";
import { Trove } from "@rbxts/trove";

export class ToolTag extends Tag {
	public trove = new Trove();
	public actionTrove = new Trove();
	public actionAnimator = undefined as ActionAnimator | undefined;
	public equipped: boolean = false;

	protected Equipped(): boolean {
		if (this.equipped) return false;
		if (this.instance.Parent !== CharacterService.char) {
			return false;
		}

		this.LoadAnimations();
		return true;
	}

	protected Unequipped() {
		this.UnloadAnimations();
		this.actionTrove.clean();
	}

	private LoadAnimations() {
		const animations = Prefabs.Animations.Tools.FindFirstChild(this.instance.Name, true);
		if (!animations) return;

		const baseAnimations = animations.FindFirstChild("Base") as Folder | undefined;
		const actionAnimations = animations.FindFirstChild("Action") as Folder | undefined;

		//if (baseAnimations && CharacterService.characterAnimator)
		//	CharacterService.characterAnimator.LoadAnimations(baseAnimations);
		//
		//if (actionAnimations && CharacterService.animator) {
		//	this.actionAnimator = new ActionAnimator(CharacterService.animator);
		//	this.actionAnimator.LoadAnimations(actionAnimations);
		//}
	}

	private UnloadAnimations() {
		if (this.actionAnimator) {
			this.actionAnimator.Destroy(0.5);
			this.actionAnimator = undefined;
		}

		const animations = Prefabs.Animations.Tools.FindFirstChild(this.instance.Name, true);
		if (!animations) return;

		const baseAnimations = animations.FindFirstChild("Base") as Folder | undefined;

		if (baseAnimations && CharacterService.characterAnimator)
			CharacterService.characterAnimator.UnloadAnimations(baseAnimations);
	}

	constructor(instance: Instance, toolclass: string) {
		super(instance, toolclass);

		this.trove.add(
			(instance as Tool).Equipped.Connect(() => {
				this.Equipped();
			}),
		);

		this.trove.add(
			(instance as Tool).Unequipped.Connect(() => {
				this.Unequipped();
			}),
		);
	}

	Destroy() {
		this.Unequipped();
		this.trove.clean();
		this.UnloadAnimations();
	}
}
