import Prefabs from "shared/libraries/Prefabs";
import { Tag } from "./Tag";
import CharacterService from "client/services/CharacterService";

export class ToolTag extends Tag {
	protected tool: Tool;
	protected class: string;
	protected animationTracks = new Map<string, AnimationTrack>();

	private LoadAnimations() {
		if (!CharacterService.characterAnimator) return;
		const animations = Prefabs.Animations.Tools.FindFirstChild(this.tool.Name, true);
		if (!animations) return;

		const baseAnimations = animations.FindFirstChild("Base") as Folder | undefined;
		const actionAnimations = animations.FindFirstChild("Action") as Folder | undefined;

		if (baseAnimations) {
			CharacterService.characterAnimator.LoadAnimations(baseAnimations);
		}
	}

	constructor(tool: Tool, toolclass: string) {
		super();
		this.tool = tool;
		this.class = toolclass;

		this.LoadAnimations();
	}

	Destroy() {
		print("remove tool", this.tool);
	}
}
