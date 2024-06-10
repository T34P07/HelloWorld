import { CharacterServiceType } from "client/types/service_types/CharacterServiceType";
import Prefabs from "../../shared/libraries/Prefabs";
import { CharacterRotation } from "../render_pipeline/nodes/character_nodes/CharacterRotation";
import { CharacterTilt } from "client/render_pipeline/nodes/character_nodes/CharacterTilt";
import { RenderPipeline } from "../render_pipeline/RenderPipeline";
import { CharacterNodeInputType } from "client/types/node_types/CharacterNodeInputType";
import { deepCopy } from "@rbxts/deepcopy";
import { CharacterAnimator } from "./CharacterAnimator";
import { Players, RunService, Workspace } from "@rbxts/services";

print("Module is initialized on VM");

const localPlayer = Players.LocalPlayer;
const camera = Workspace.CurrentCamera;

export type action = string | undefined;

const CharacterService: CharacterServiceType = {
	characterAnimator: undefined,
	action: undefined,
	autoRotate: true,
	viewmodelParts: ["Left Arm", "Right Arm", "Left Leg", "Right Leg", "Torso"],
	cooldowns: [],
	char: undefined,
	hrp: undefined,
	hum: undefined,
	torso: undefined,
	head: undefined,
	leftArm: undefined,
	rightArm: undefined,
	leftLeg: undefined,
	rightLeg: undefined,
	animator: undefined,
	rootJoint: undefined,
	neck: undefined,
	rootAttach: undefined,
	noCharParams: new RaycastParams(),
	animationTracks: {},
	rootPart: undefined,
	renderPipeline: new RenderPipeline([CharacterRotation, CharacterTilt]),
	OnCharacterRemoving: (character) => {
		if (CharacterService.characterAnimator) {
			CharacterService.characterAnimator.Destroy();
			CharacterService.characterAnimator = undefined;
		}
	},
	OnCharacterAdded: (character) => {
		camera!.CameraType = Enum.CameraType.Scriptable;
		CharacterService.char = character;
		CharacterService.hrp = CharacterService.char.WaitForChild("HumanoidRootPart") as Part;
		CharacterService.hum = CharacterService.char.WaitForChild("Humanoid") as Humanoid;
		CharacterService.torso = CharacterService.char.WaitForChild("Torso") as Part;
		CharacterService.head = CharacterService.char.WaitForChild("Head") as Part;
		CharacterService.leftArm = CharacterService.char.WaitForChild("Left Arm") as Part;
		CharacterService.rightArm = CharacterService.char.WaitForChild("Right Arm") as Part;
		CharacterService.leftLeg = CharacterService.char.WaitForChild("Left Leg") as Part;
		CharacterService.rightLeg = CharacterService.char.WaitForChild("Right Leg") as Part;
		CharacterService.animator = CharacterService.hum.WaitForChild("Animator") as Animator;

		CharacterService.hum.CameraOffset = new Vector3(0, 0, 1);
		CharacterService.hum.WalkSpeed = 30;
		CharacterService.hum.AutoRotate = false;

		const rootJoint = CharacterService.hrp.WaitForChild("RootJoint") as Motor6D;
		const neck = CharacterService.torso.WaitForChild("Neck") as Motor6D;

		CharacterService.rootJoint = { instance: rootJoint, c0: rootJoint.C0, c1: rootJoint.C1 };
		CharacterService.neck = { instance: neck, c0: neck.C0, c1: neck.C1 };

		CharacterService.rootAttach = CharacterService.hrp.WaitForChild("RootAttachment") as Attachment;
		CharacterService.noCharParams.FilterDescendantsInstances = [CharacterService.char];

		CharacterService.animationTracks = {};

		Prefabs.Animations.Movement.Abilities.GetDescendants().forEach((animation) => {
			if (!animation.IsA("Animation") || !CharacterService.animator) return;

			CharacterService.animationTracks[animation.Name] = CharacterService.animator.LoadAnimation(animation);
		});

		CharacterService.characterAnimator = new CharacterAnimator(CharacterService.char);
		CharacterService.characterAnimator.LoadAnimations(Prefabs.Animations.Movement.Base);
	},
	OnViewmodelUpdate: () => {
		if (!CharacterService.char) return;

		const mode = camera!.GetAttribute("Mode");

		CharacterService.char.GetDescendants().forEach((child) => {
			if (child.IsA("BasePart") || child.IsA("Decal")) {
				child.LocalTransparencyModifier =
					mode !== 0
						? 0
						: CharacterService.viewmodelParts.find((part) => part === child.Name) ||
							  child.FindFirstAncestorWhichIsA("Tool")
							? child.Transparency
							: 1;
			}
		});
	},
	PreStart: () => {
		CharacterService.rootPart = new Instance("Part");
		CharacterService.rootPart.Anchored = true;
		CharacterService.rootPart.Transparency = 1;
		CharacterService.rootPart.CanCollide = false;
		CharacterService.rootPart.CanTouch = false;
		CharacterService.rootPart.CanQuery = false;
		CharacterService.rootPart.Size = Vector3.one;
		CharacterService.rootPart.Parent = Workspace;

		CharacterService.noCharParams.FilterType = Enum.RaycastFilterType.Exclude;
	},
	Start: () => {
		localPlayer.CharacterAdded.Connect(CharacterService.OnCharacterAdded);

		if (localPlayer.Character) CharacterService.OnCharacterAdded(localPlayer.Character);

		RunService.BindToRenderStep("CharacterUpdate", Enum.RenderPriority.Character.Value, CharacterService.Update);
		RunService.PreRender.Connect(CharacterService.OnViewmodelUpdate);
	},
	Update: (dt) => {
		if (!CharacterService.hrp || !CharacterService.rootJoint) return;

		const characterNodeInput: CharacterNodeInputType = {
			hrp: { instance: CharacterService.hrp, cf: CharacterService.hrp.CFrame },
			rootJoint: deepCopy(CharacterService.rootJoint),
		};

		if (CharacterService.characterAnimator) {
			CharacterService.characterAnimator.Update();
		}

		CharacterService.renderPipeline.PreUpdate(dt, characterNodeInput);

		const output = CharacterService.renderPipeline.Update(dt, characterNodeInput);
		CharacterService.hrp.CFrame = output.hrp.cf;
		CharacterService.rootJoint.instance.C0 = output.rootJoint.c0;
		CharacterService.rootJoint.instance.C1 = output.rootJoint.c1;

		CharacterService.renderPipeline.PostUpdate(dt, characterNodeInput);
	},
	GetCharacterAnimator: () => {
		print("return character animator", CharacterService.characterAnimator);
		return CharacterService.characterAnimator;
	},
};

export default CharacterService;
