import { AnimationServiceType } from "client/types/service_types/AnimationServiceType";

const AnimationService: AnimationServiceType = {
	animationsCollection: new Map(),
	LoadAnimations: (name, animator, animationsFolder) => {
		const animations = AnimationService.animationsCollection.get(name) ?? new Map();

		animationsFolder.GetDescendants().forEach((animation) => {
			if (!animation.IsA("Animation")) return;

			const animationTracks = animations.get(animation.Name) ?? [];
			const animationTrack = animator.LoadAnimation(animation);
			const weight = animation.GetAttribute("Weight") as number;

			if (weight) animationTrack.AdjustWeight(weight);

			animationTracks.push(animationTrack);

			animations.set(animation.Name, animationTracks);
		});

		AnimationService.animationsCollection.set(name, animations);
	},
	UnloadAnimations: (name, fadeTime) => {
		const animations = AnimationService.animationsCollection.get(name);
		if (!animations) return;

		animations.forEach((animationTracks) => {
			animationTracks.forEach((animationTrack) => {
				animationTrack.Stop(fadeTime);
			});
		});
	},
	GetAnimationTrack: (name, animationName) => {
		const animations = AnimationService.animationsCollection.get(name);
		if (!animations) return;

		const animationTracks = animations.get(animationName);
		if (!animationTracks) return;

		let lastWeight = 0;
		let randomAnimationTracks: AnimationTrack[] = [];

		animationTracks.forEach((animationTrack) => {
			let weight = animationTrack.Animation!.GetAttribute("Weight") as number;
			weight = weight ?? 0;

			if (randomAnimationTracks.size() < 1 || weight > lastWeight) {
				lastWeight = weight;
				randomAnimationTracks = [animationTrack];
			} else if (weight === lastWeight) {
				randomAnimationTracks.push(animationTrack);
			}
		});

		if (randomAnimationTracks.size() > 0) {
			return randomAnimationTracks[math.random(randomAnimationTracks.size()) - 1];
		}
	},
};

export default AnimationService;
