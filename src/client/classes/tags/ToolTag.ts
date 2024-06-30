import Prefabs from "shared/libraries/Prefabs";
import { Tag } from "./Tag";
import CharacterService from "client/services/CharacterService";
import CameraService from "client/services/CameraService";
import { ActionAnimator } from "client/services/ActionAnimator";
import { Trove } from "@rbxts/trove";
import AttachToRig from "shared/utilities/AttachToRig";

export class ToolTag extends Tag {
	public trove = new Trove();
	public actionTrove = this.trove.extend();
	public actionAnimator = undefined as ActionAnimator | undefined;
	public equipped: boolean = false;
	protected viewmodelTool: Tool | undefined;

	protected Equipped(): boolean {
		if (this.equipped) return false;
		if (this.instance.Parent !== CharacterService.char) {
			return false;
		}

		this.viewmodelTool = Prefabs.Tools.FindFirstChild(this.instance.Name)!.Clone() as Tool;
		this.actionTrove.add(this.viewmodelTool);
		this.viewmodelTool.Parent = CameraService.viewmodel;

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

		if (baseAnimations && CharacterService.characterAnimator)
			CharacterService.characterAnimator.LoadAnimations(baseAnimations);

		if (actionAnimations && CharacterService.animator) {
			this.actionAnimator = new ActionAnimator(CharacterService.char as Model, CameraService.viewmodel);
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

		if (instance.IsDescendantOf(CameraService.viewmodel)) {
			AttachToRig(instance, CameraService.viewmodel, "Viewmodel");
			return;
		}

		this.trove.connect(
			(instance as Tool).Equipped, () => {
				this.Equipped();
			},
		);

		this.trove.connect(
			(instance as Tool).Unequipped, () => {
				this.Unequipped();
			},
		);
	}

	Destroy() {
		this.Unequipped();
		this.trove.clean();
		this.UnloadAnimations();
	}
}
