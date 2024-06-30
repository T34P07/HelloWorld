import AttachToRig from "shared/utilities/AttachToRig";
import { Tag } from "./Tag";

export class ToolTag extends Tag {
	private rig;

	constructor(instance: Instance, tagClass: string) {
		super(instance, tagClass);

		this.rig = this.instance.Parent as Model;
		AttachToRig(this.instance, this.rig, "Character");
	}

	Destroy() { }
}
