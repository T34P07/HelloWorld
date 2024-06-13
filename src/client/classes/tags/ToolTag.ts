import Prefabs from "shared/libraries/Prefabs";
import { Tag } from "./Tag";
import CharacterService from "client/services/CharacterService";
import { ActionAnimator } from "client/services/ActionAnimator";
import { Trove } from "@rbxts/trove";

export class ToolTag extends Tag {
	public trove = new Trove();
	public actionAnimator = undefined as ActionAnimator | undefined;

	private LoadAnimations() {
		const animations = Prefabs.Animations.Tools.FindFirstChild(this.instance.Name, true);
		if (!animations) return;

		const baseAnimations = animations.FindFirstChild("Base") as Folder | undefined;
		const actionAnimations = animations.FindFirstChild("Action") as Folder | undefined;

		if (baseAnimations && CharacterService.characterAnimator)
			CharacterService.characterAnimator.LoadAnimations(baseAnimations);

		if (actionAnimations && CharacterService.animator) {
			this.actionAnimator = new ActionAnimator(CharacterService.animator);
			this.actionAnimator.LoadAnimations(actionAnimations);
		}
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

		this.LoadAnimations();
	}

	Destroy() {
		this.trove.clean();
		this.UnloadAnimations();
	}
}
