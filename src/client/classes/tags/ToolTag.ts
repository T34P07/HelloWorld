import Prefabs from "shared/libraries/Prefabs";
import { Tag } from "./Tag";

export class ToolTag extends Tag {
	protected tool: Tool;
	protected class = "Tool";
	private animationTracks = new Map<string, AnimationTrack>();

	constructor(tool: Tool, toolclass: string) {
		super();
		this.tool = tool;
		this.class = toolclass;

		print(this.tool, this.class);

		//const animations = Prefabs.Animations.Tools.FindFirstChild
	}

	Destroy() {
		print("remove tool", this.tool);
	}
}
