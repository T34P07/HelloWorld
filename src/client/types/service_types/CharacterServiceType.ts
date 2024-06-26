import { Dash } from "client/classes/abilities/Dash";
import { RenderPipeline } from "client/render_pipeline/RenderPipeline";
import { CharacterAnimator } from "client/services/CharacterAnimator";

export type CharacterActionType = string | undefined;

export type CharacterServiceType = {
	dash: Dash | undefined,
	characterAnimator: CharacterAnimator | undefined;
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
	bodyColors: BodyColors | undefined;
	rootJoint: { instance: Motor6D; c0: CFrame; c1: CFrame } | undefined;
	neck: { instance: Motor6D; c0: CFrame; c1: CFrame } | undefined;
	viewmodel: Model | undefined;
	rootAttach: Attachment | undefined;
	noCharRaycastParams: RaycastParams;
	noCharOverlapParams: OverlapParams;
	animationTracks: Record<string, AnimationTrack>;
	rootPart: Part | undefined;
	renderPipeline: RenderPipeline;
	OnCharacterAdded: (character: Model) => void;
	OnCharacterRemoving: (character: Model) => void;
	OnViewmodelUpdate: (dt: number) => void;
	PreStart: () => void;
	Start: () => void;
	Update: (dt: number) => void;
};
