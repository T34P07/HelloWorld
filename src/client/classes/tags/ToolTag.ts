import Prefabs from "shared/libraries/Prefabs";
import { Tag } from "./Tag";
import CharacterService from "client/services/CharacterService";
import AnimationService from "client/services/AnimationService";
import { Janitor } from "@rbxts/janitor";

export class ToolTag extends Tag {
	protected tool: Tool;
	protected class: string;
	protected animationTracks = new Map<string, AnimationTrack>();
	private janitor = new Janitor();

	private Activated() {
		print("activated");
	}

	private LoadAnimations() {
		const animations = Prefabs.Animations.Tools.FindFirstChild(this.tool.Name, true);
		if (!animations) return;

		const baseAnimations = animations.FindFirstChild("Base") as Folder | undefined;
		const actionAnimations = animations.FindFirstChild("Action") as Folder | undefined;

		if (baseAnimations && CharacterService.characterAnimator)
			CharacterService.characterAnimator.LoadAnimations(baseAnimations);

		if (actionAnimations && CharacterService.animator)
			AnimationService.LoadAnimations("Tool", CharacterService.animator, actionAnimations);
	}

	private UnloadAnimations() {
		print("UnloadAnimations");
		AnimationService.UnloadAnimations("Tool", 0.5);

		const animations = Prefabs.Animations.Tools.FindFirstChild(this.tool.Name, true);
		if (!animations) return;

		const baseAnimations = animations.FindFirstChild("Base") as Folder | undefined;
		print(baseAnimations && CharacterService.characterAnimator);
		if (baseAnimations && CharacterService.characterAnimator)
			CharacterService.characterAnimator.UnloadAnimations(baseAnimations);
	}

	constructor(instance: Instance, toolclass: string) {
		super();
		this.tool = instance as Tool;
		this.class = toolclass;

		this.LoadAnimations();
		this.janitor.Add(
			this.tool.Activated.Connect(() => {
				this.Activated();
			}),
		);
	}

	Destroy() {
		this.janitor.Cleanup();
		this.UnloadAnimations();
	}
}
