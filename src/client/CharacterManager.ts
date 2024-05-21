const Workspace = game.GetService("Workspace");
const RunService = game.GetService("RunService");
const Players = game.GetService("Players");
const ReplicatedStorage = game.GetService("ReplicatedStorage");
const UserInputService = game.GetService("UserInputService");

import CameraManager from "./CameraManager";
import AnimationManager from "./AnimationManager";
import Prefabs from "./services/Prefabs";

const localPlayer = Players.LocalPlayer;

const vectorXZ = new Vector3(1, 0, 1);

export type action = string | undefined;

type CharacterManager = {
	action: action;
	autoRotate: boolean;
	visibleBodyParts: string[];
	cooldowns: [];
	char: Model | undefined;
	hrp: Part | undefined;
	hum: Humanoid | undefined;
	torso: Part | undefined;
	head: Part | undefined;
	leftArm: Part | undefined;
	rightArm: Part | undefined;
	leftLeg: Part | undefined;
	rightLeg: Part | undefined;
	animator: Animator | undefined;
	rootJoint: { instance: Motor6D; c0: CFrame; c1: CFrame } | undefined;
	neck: { instance: Motor6D; c0: CFrame; c1: CFrame } | undefined;
	rootAttach: Attachment | undefined;
	noCharParams: RaycastParams;
	animationTracks: Record<string, AnimationTrack>;
	rootPart: Part | undefined;
	OnCharacterAdded: (Character: Model) => void;
	PreStart: () => void;
	Start: () => void;
};

const CharacterManager: CharacterManager = {
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
		CharacterManager.char = Character;
		CharacterManager.hrp = CharacterManager.char.WaitForChild("HumanoidRootPart") as Part;
		CharacterManager.hum = CharacterManager.char.WaitForChild("Humanoid") as Humanoid;
		CharacterManager.torso = CharacterManager.char.WaitForChild("Torso") as Part;
		CharacterManager.head = CharacterManager.char.WaitForChild("Head") as Part;
		CharacterManager.leftArm = CharacterManager.char.WaitForChild("Left Arm") as Part;
		CharacterManager.rightArm = CharacterManager.char.WaitForChild("Right Arm") as Part;
		CharacterManager.leftLeg = CharacterManager.char.WaitForChild("Left Leg") as Part;
		CharacterManager.rightLeg = CharacterManager.char.WaitForChild("Right Leg") as Part;
		CharacterManager.animator = CharacterManager.hum.WaitForChild("Animator") as Animator;

		const rootJoint = CharacterManager.hrp.WaitForChild("RootJoint") as Motor6D;
		const neck = CharacterManager.torso.WaitForChild("Neck") as Motor6D;

		CharacterManager.rootJoint = { instance: rootJoint, c0: rootJoint.C0, c1: rootJoint.C1 };
		CharacterManager.neck = { instance: neck, c0: neck.C0, c1: neck.C1 };

		CharacterManager.rootAttach = CharacterManager.hrp.WaitForChild("RootAttachment") as Attachment;
		CharacterManager.noCharParams.FilterDescendantsInstances = [CharacterManager.char];

		CharacterManager.animationTracks = {};

		Prefabs.Animations.Movement.Abilities.GetDescendants().forEach((animation) => {
			if (!animation.IsA("Animation") || !CharacterManager.animator) return;

			CharacterManager.animationTracks[animation.Name] = CharacterManager.animator.LoadAnimation(animation);
		});

		print("SET FIGURE!");
		AnimationManager.SetFigure(CharacterManager.char);
		AnimationManager.LoadAnimations(Prefabs.Animations.Movement.Base);
	},
	PreStart: () => {
		CharacterManager.rootPart = new Instance("Part");
		CharacterManager.rootPart.Anchored = true;
		CharacterManager.rootPart.Transparency = 1;
		CharacterManager.rootPart.CanCollide = false;
		CharacterManager.rootPart.CanTouch = false;
		CharacterManager.rootPart.CanQuery = false;
		CharacterManager.rootPart.Size = Vector3.one;
		CharacterManager.rootPart.Parent = Workspace;

		CharacterManager.noCharParams.FilterType = Enum.RaycastFilterType.Exclude;
	},
	Start: () => {
		localPlayer.CharacterAdded.Connect(CharacterManager.OnCharacterAdded);

		if (localPlayer.Character) CharacterManager.OnCharacterAdded(localPlayer.Character);
	},
};

export default CharacterManager;
