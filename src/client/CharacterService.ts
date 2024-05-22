const Workspace = game.GetService("Workspace");
const RunService = game.GetService("RunService");
const Players = game.GetService("Players");
const ReplicatedStorage = game.GetService("ReplicatedStorage");
const UserInputService = game.GetService("UserInputService");

import { CharacterServiceType } from "./types/ServiceType";
import AnimationService from "./AnimationService";
import Prefabs from "./services/Prefabs";

const localPlayer = Players.LocalPlayer;

const vectorXZ = new Vector3(1, 0, 1);

export type action = string | undefined;

const CharacterService: CharacterServiceType = {
	action: undefined,
	autoRotate: true,
	visibleBodyParts: ["Left Arm", "Right Arm", "Left Leg", "Right Leg", "Torso"],
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
	OnCharacterAdded: (Character): void => {
		CharacterService.char = Character;
		CharacterService.hrp = CharacterService.char.WaitForChild("HumanoidRootPart") as Part;
		CharacterService.hum = CharacterService.char.WaitForChild("Humanoid") as Humanoid;
		CharacterService.torso = CharacterService.char.WaitForChild("Torso") as Part;
		CharacterService.head = CharacterService.char.WaitForChild("Head") as Part;
		CharacterService.leftArm = CharacterService.char.WaitForChild("Left Arm") as Part;
		CharacterService.rightArm = CharacterService.char.WaitForChild("Right Arm") as Part;
		CharacterService.leftLeg = CharacterService.char.WaitForChild("Left Leg") as Part;
		CharacterService.rightLeg = CharacterService.char.WaitForChild("Right Leg") as Part;
		CharacterService.animator = CharacterService.hum.WaitForChild("Animator") as Animator;

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

		print("SET FIGURE!");
		AnimationService.SetFigure(CharacterService.char);
		AnimationService.LoadAnimations(Prefabs.Animations.Movement.Base);
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
	},
};

export default CharacterService;
