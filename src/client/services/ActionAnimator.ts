type Animations = Map<string, AnimationTrack[]>;

export class ActionAnimator {
	private animations: Animations = new Map();
	private animator: Animator;

	public LoadAnimations(animationsFolder: Folder) {
		animationsFolder.GetDescendants().forEach((animation) => {
			if (!animation.IsA("Animation")) return;

			const animationTracks = this.animations.get(animation.Name) ?? [];
			const animationTrack = this.animator.LoadAnimation(animation);
			const weight = animation.GetAttribute("Weight") as number;

			if (weight) animationTrack.AdjustWeight(weight);

			animationTracks.push(animationTrack);

			this.animations.set(animation.Name, animationTracks);
		});
	}

	public UnloadAnimations(fadeTime: number = 0) {
		this.animations.forEach((animationTracks) => {
			animationTracks.forEach((animationTrack) => {
				animationTrack.Stop(fadeTime);
			});
		});
	}

	public GetAnimationTrack(animationName: string) {
		const animationTracks = this.animations.get(animationName);
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
	}

	public PlayAnimation(animationName: string, fadeTime: number = 0) {
		const animationTrack = this.GetAnimationTrack(animationName);
		if (!animationTrack) return;

		animationTrack.Play(fadeTime);
		return animationTrack;
	}

	public StopAnimation() {}

	constructor(animator: Animator) {
		this.animator = animator;
	}

	public Destroy(fadeTime: number = 0) {
		this.UnloadAnimations(fadeTime);
	}
}
