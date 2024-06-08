import { Janitor } from "@rbxts/janitor";
import { RenderPipeline } from "client/render_pipeline/RenderPipeline";
import { Tag } from "client/classes/tags/Tag";

export type ClientEngineType = {
	Modules: {};
	StartModules: () => void;
	PreStartModules: () => void;
	LoadGame: () => void;
	PreStart: () => void;
};

export type AnimationServiceType = {
	figure: Model | undefined;
	humanoid: Humanoid | undefined;
	animator: Animator | undefined;
	animationTracks: Record<string, AnimationTrack[]>;
	pose: string;
	animationTrack: AnimationTrack | undefined;
	transitionTime: number;
	lastJump: number;
	jumpVar: number;
	lastUpdate: number;
	jumpAnimDuration: number;
	LoadAnimations: (animations: Folder) => void;
	UnloadAnimations: (animations: Folder) => void;
	GetAnimationTrack: (animationTracks: AnimationTrack[]) => AnimationTrack | undefined;
	PlayAnimation: (name: string, transitionTime: number | void) => AnimationTrack | void;
	StopAllAnimations: () => void;
	UnloadAllAnimations: () => void;
	OnRunning: (speed: number) => void;
	OnDied: () => void;
	OnJumping: () => void;
	OnClimbing: (speed: number) => void;
	OnGettingUp: () => void;
	OnFreeFall: () => void;
	OnFallingDown: () => void;
	OnSeated: () => void;
	OnPlatformStanding: () => void;
	OnSwimming: (speed: number) => void;
	Update: () => void;
	SetFigure: (figure: Model) => void;
	Start: () => void;
};

export type CameraServiceType = {
	modifiers: {
		principalAxes: {};
	};
	camera: Camera | undefined;
	renderPipeline: RenderPipeline;
	Update: (dt: number) => void;
	Start: () => void;
};

export type CharacterActionType = string | undefined;

export type CharacterServiceType = {
	action: CharacterActionType;
	autoRotate: boolean;
	viewmodelParts: string[];
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
	renderPipeline: RenderPipeline;
	OnCharacterAdded: (Character: Model) => void;
	OnViewmodelUpdate: (dt: number) => void;
	PreStart: () => void;
	Start: () => void;
	Update: (dt: number) => void;
};

export type InputActionCallback = (name: string, userInputState: Enum.UserInputState, inputObject: InputObject) => void;

export type InputServiceType = {
	Actions: Record<string, InputActionCallback>;
	BindAction: (name: string, callback: InputActionCallback) => void;
	OnInputBegan: (inputObject: InputObject, gameProcessedEvent: boolean) => void;
	OnInputEnded: (inputObject: InputObject, gameProcessedEvent: boolean) => void;
	IsInputActive: (name: string) => boolean;
	Start: () => void;
};

export type TagConstructorType = new (instance: Instance) => Tag;

export type TagClassModuleExportsType = { [key: string]: unknown };

export type TagHandlerType = {
	janitor: Janitor;
	instances: Map<Instance, Tag | undefined>;
};
export type ClientTagServiceType = {
	TagHandlers: {
		[tag: string]: TagHandlerType | undefined;
	};
	GetTagClass: (tag: string) => TagConstructorType | void;
	OnInstanceAdded: (tag: string, instance: Instance, tagHandler: TagHandlerType) => void;
	OnInstanceRemoved: (tag: string, instance: Instance, tagHandler: TagHandlerType) => void;
	OnTagAdded: (tag: string) => void;
	OnTagRemoved: (tag: string) => void;
	Start: () => void;
};
