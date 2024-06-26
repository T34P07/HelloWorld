import { CharacterServiceType } from "client/types/service_types/CharacterServiceType";
import Prefabs from "../../shared/libraries/Prefabs";
import { CharacterRotation } from "../render_pipeline/nodes/character_nodes/CharacterRotation";
import { CharacterTilt } from "client/render_pipeline/nodes/character_nodes/CharacterTilt";
import { RenderPipeline } from "../render_pipeline/RenderPipeline";
import { CharacterNodeInputType } from "client/types/node_types/CharacterNodeInputType";
import { deepCopy } from "@rbxts/deepcopy";
import { CharacterAnimator } from "./CharacterAnimator";
import { ContentProvider, Players, RunService, Workspace } from "@rbxts/services";
import RunConfig from "client/config/RunConfig";
import { Dash } from "client/classes/abilities/Dash";
import ControlService from "./ControlService";
import InputService from "./InputService";

const localPlayer = Players.LocalPlayer;
const camera = Workspace.CurrentCamera;

export type action = string | undefined;

const CharacterService: CharacterServiceType = {
	dash: undefined,
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
	bodyColors: undefined,
	neck: undefined,
	rootAttach: undefined,
	viewmodel: undefined,
	noCharRaycastParams: new RaycastParams(),
	noCharOverlapParams: new OverlapParams(),
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
		CharacterService.bodyColors = CharacterService.char.WaitForChild("Body Colors") as BodyColors;

		CharacterService.hum.CameraOffset = new Vector3(0, 0, 1);
		CharacterService.hum.WalkSpeed = RunConfig.Speed;
		CharacterService.hum.AutoRotate = false;

		const rootJoint = CharacterService.hrp.WaitForChild("RootJoint") as Motor6D;
		const neck = CharacterService.torso.WaitForChild("Neck") as Motor6D;

		CharacterService.rootJoint = { instance: rootJoint, c0: rootJoint.C0, c1: rootJoint.C1 };
		CharacterService.neck = { instance: neck, c0: neck.C0, c1: neck.C1 };

		CharacterService.rootAttach = CharacterService.hrp.WaitForChild("RootAttachment") as Attachment;
		CharacterService.noCharRaycastParams.FilterDescendantsInstances = [CharacterService.char];
		CharacterService.noCharOverlapParams.FilterDescendantsInstances = [CharacterService.char];

		CharacterService.animationTracks = {};

		//Prefabs.Animations.Movement.Abilities.GetDescendants().forEach((animation) => {
		//	if (!animation.IsA("Animation") || !CharacterService.animator) return;
		//
		//	CharacterService.animationTracks[animation.Name] = CharacterService.animator.LoadAnimation(animation);
		//});

		CharacterService.viewmodel = camera!.WaitForChild("Viewmodel") as Model;
		CharacterService.bodyColors.Clone().Parent = CharacterService.viewmodel;

		ContentProvider.PreloadAsync([
			CharacterService.char,
			CharacterService.viewmodel,
			Prefabs.Animations.Movement.Base,
		]);
		CharacterService.characterAnimator = new CharacterAnimator(CharacterService.char, CharacterService.viewmodel);
		CharacterService.characterAnimator.LoadAnimations(Prefabs.Animations.Movement.Base);

		CharacterService.dash = new Dash(CharacterService);
	},
	OnViewmodelUpdate: () => {
		if (!CharacterService.char || !CharacterService.viewmodel) return;

		const mode = camera!.GetAttribute("Mode");
		const isViewmodelVisible = mode === 0 && CharacterService.char!.FindFirstChildWhichIsA("Tool") ? true : false;

		CharacterService.char.GetDescendants().forEach((descendant: Instance) => {
			if (descendant.IsA("BasePart") || descendant.IsA("Decal")) {
				descendant.LocalTransparencyModifier =
					mode !== 0
						? 0
						: !isViewmodelVisible &&
							  CharacterService.viewmodelParts.find((part) => part === descendant.Name)
							? descendant.Transparency
							: 1;
			}
		});

		CharacterService.viewmodel.GetDescendants().forEach((descendant: Instance) => {
			if (descendant.IsA("BasePart") || descendant.IsA("Decal")) {
				descendant.LocalTransparencyModifier = isViewmodelVisible ? descendant.Transparency : 1;
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

		CharacterService.noCharRaycastParams.FilterType = Enum.RaycastFilterType.Exclude;
		CharacterService.noCharOverlapParams.FilterType = Enum.RaycastFilterType.Exclude;
	},
	Start: () => {
		localPlayer.CharacterAdded.Connect(CharacterService.OnCharacterAdded);

		if (localPlayer.Character) CharacterService.OnCharacterAdded(localPlayer.Character);

		RunService.BindToRenderStep("CharacterUpdate", Enum.RenderPriority.Character.Value, CharacterService.Update);
		RunService.PreRender.Connect(CharacterService.OnViewmodelUpdate);

		ControlService.Start(CharacterService);
		InputService.BindAction("Dash").Connect(
			(actionName: string, userInputState: Enum.UserInputState, inputObject: InputObject) => {
				if (userInputState !== Enum.UserInputState.Begin) return;

				CharacterService.dash?.Start();
			},
		);
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
};

export default CharacterService;
