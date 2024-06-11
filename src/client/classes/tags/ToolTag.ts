import Prefabs from "shared/libraries/Prefabs";
import { Tag } from "./Tag";
import CharacterService from "client/services/CharacterService";
import { ActionAnimator } from "client/services/ActionAnimator";
import { Janitor } from "@rbxts/janitor";

export class ToolTag extends Tag {
	protected tool: Tool;
	protected class: string;
	public janitor = new Janitor();
	public actionAnimator = undefined as ActionAnimator | undefined;

	private LoadAnimations() {
		const animations = Prefabs.Animations.Tools.FindFirstChild(this.tool.Name, true);
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

		const animations = Prefabs.Animations.Tools.FindFirstChild(this.tool.Name, true);
		if (!animations) return;

		const baseAnimations = animations.FindFirstChild("Base") as Folder | undefined;

		if (baseAnimations && CharacterService.characterAnimator)
			CharacterService.characterAnimator.UnloadAnimations(baseAnimations);
	}

	constructor(instance: Instance, toolclass: string) {
		super();
		this.tool = instance as Tool;
		this.class = toolclass;

		this.LoadAnimations();
	}

	Destroy() {
		this.janitor.Cleanup();
		this.UnloadAnimations();
	}
}
