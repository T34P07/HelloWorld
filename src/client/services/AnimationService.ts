type animationTracks = AnimationTrack[];
type animations = Map<string, animationTracks>;
type animationsGroup = Map<string, animations>;

type AnimationServiceType = {
	animationTracks: animations;
	LoadAnimations: (name: string, animationsFolder: Folder) => void;
	UnloadAnimations: (name: string) => void;
	GetAnimationTrack: (name: string, animationTrackName: string) => void;
};

const AnimationService: AnimationServiceType = {
	animationTracks: new Map(),
	LoadAnimations: (name, animator, animationsFolder) => {
		animationsFolder.GetDescendants().forEach((animation) => {
			if (!animation.IsA("Animation") || !animator) return;

			const animationTracks = [];

			let animationTracks = AnimationService.animationTracks.get(animation.Name);
			animationTracks = animationTracks ? animationTracks : [];
			AnimationService.animationTracks.set(animation.Name, animationTracks);

			const animationTrack = animator.LoadAnimation(animation);
			const weight = animation.GetAttribute("Weight") as number;

			if (weight) animationTrack.AdjustWeight(weight);

			animationTracks.push(animationTrack);
			print(animationTracks);
		});
	},
	UnloadAnimations: () => {},
	GetAnimationTrack: () => {},
};

export default AnimationService;
