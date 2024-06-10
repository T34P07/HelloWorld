import Prefabs from "shared/libraries/Prefabs";
import { Tag } from "./Tag";
import CharacterService from "client/services/CharacterService";

export class ToolTag extends Tag {
	protected tool: Tool;
	protected class: string;
	protected animationTracks = new Map<string, AnimationTrack>();

	private LoadAnimations() {
		const animations = Prefabs.Animations.Tools.FindFirstChild(this.tool.Name, true);
		if (!animations) return;

		const baseAnimations = animations.FindFirstChild("Base") as Folder | undefined;
		const actionAnimations = animations.FindFirstChild("Action") as Folder | undefined;

		if (baseAnimations && CharacterService.characterAnimator)
			CharacterService.characterAnimator.LoadAnimations(baseAnimations);
	}

	constructor(instance: Instance, toolclass: string) {
		super();
		this.tool = instance as Tool;
		this.class = toolclass;

		this.LoadAnimations();
	}

	Destroy() {}
}
