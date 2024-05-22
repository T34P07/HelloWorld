import { RenderPipeline } from "client/render_pipeline/RenderPipeline";

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
	mode: number;
	submode: number;
	offset: Vector3;
	modifiers: {
		principalAxes: {};
	};
	camera: Camera | undefined;
	renderPipeline: RenderPipeline;
	Update: (dt: number) => void;
	Start: () => void;
};

export type actionType = string | undefined;

export type CharacterServiceType = {
	action: actionType;
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
