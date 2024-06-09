import Prefabs from "shared/libraries/Prefabs";
import { Tag } from "./Tag";
import AnimationService from "client/services/AnimationService";

export class ToolTag extends Tag {
	protected tool: Tool;
	protected class: string;
	protected animationTracks = new Map<string, AnimationTrack>();

	private LoadAnimations() {
		const animations = Prefabs.Animations.Tools.FindFirstChild(this.tool.Name, true);
		if (!animations) return;

		const baseAnimations = animations.FindFirstChild("Base") as Folder | undefined;
		const actionAnimations = animations.FindFirstChild("Action") as Folder | undefined;

		if (baseAnimations) {
			AnimationService.LoadAnimations(baseAnimations);
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
