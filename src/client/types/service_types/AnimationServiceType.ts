type Animations = Map<string, AnimationTrack[]>;

export type AnimationServiceType = {
	animationsCollection: Map<string, Animations>;
	LoadAnimations: (name: string, animator: Animator, animationsFolder: Folder) => void;
	UnloadAnimations: (name: string, fadeTime: number) => void;
	GetAnimationTrack: (name: string, animationName: string) => void;
};
