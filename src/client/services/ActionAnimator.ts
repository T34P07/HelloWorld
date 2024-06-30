type AnimationTracks = {
	character: Map<string, AnimationTrack[]>;
	viewmodel: Map<string, AnimationTrack[]>;
};

type Rigs = {
	character: Model | undefined;
	viewmodel: Model | undefined;
};

type RigName = "viewmodel" | "character";

export type GroupAnimationsTracks = {
	viewmodel: AnimationTrack;
	character: AnimationTrack;
}

export class ActionAnimator {
	private rigs: Rigs = {
		character: undefined,
		viewmodel: undefined,
	};

	private fadeTime = 0.1;

	private animationTracks: AnimationTracks = {
		character: new Map<string, AnimationTrack[]>(),
		viewmodel: new Map<string, AnimationTrack[]>(),
	};

	public LoadAnimations(animations: Folder) {
		animations.GetDescendants().forEach((animation) => {
			if (!animation.IsA("Animation")) return;

			const groupName = animation.Parent!.Name.lower() as RigName;
			const groupAnimationTracks = this.animationTracks[groupName];

			const rig = this.rigs[groupName];
			if (!rig) return;

			const animator = rig.FindFirstChildWhichIsA("Animator", true);
			if (!animator) return;

			let animationTracks = groupAnimationTracks.get(animation.Name);
			animationTracks = animationTracks ? animationTracks : [];
			groupAnimationTracks.set(animation.Name, animationTracks);

			const animationTrack = animator.LoadAnimation(animation);
			const weight = animation.GetAttribute("Weight") as number;

			if (weight) animationTrack.AdjustWeight(weight);
			animationTracks.push(animationTrack);
		});
	}

	public UnloadAnimations(fadeTime: number = this.fadeTime) {
		for (const [_, groupAnimationsTracks] of pairs(this.animationTracks)) {
			for (const animationPairs of pairs(groupAnimationsTracks)) {
				const [_, animationTracks] = animationPairs;

				animationTracks.forEach((animationTrack, index) => {
					if (animationTrack.Animation) {
						animationTrack.Stop();
						animationTracks.remove(index);
					}

					return;
				});
			}
		}
	}

	private ChooseAnimationTrack(animationTracks: AnimationTrack[]) {
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

	public GetGroupAnimationTracks(name: string) {
		const groupAnimationsTracks = {} as GroupAnimationsTracks;

		for (const [groupName, _groupAnimationsTracks] of pairs(this.animationTracks)) {
			const animationTracks = _groupAnimationsTracks.get(name);
			if (!animationTracks) continue;

			const animationTrack = this.ChooseAnimationTrack(animationTracks) as AnimationTrack;
			if (!animationTrack) continue;

			groupAnimationsTracks[groupName] = animationTrack;
		}

		return groupAnimationsTracks;
	}

	public PlayAnimation(name: string, fadeTime: number = this.fadeTime, speed: number = 1) {
		for (const [groupName, groupAnimationsTracks] of pairs(this.animationTracks)) {
			const animationTracks = groupAnimationsTracks.get(name);
			if (!animationTracks) continue;

			const animationTrack = this.ChooseAnimationTrack(animationTracks) as AnimationTrack;
			if (!animationTrack) continue;

			animationTrack.Play(fadeTime);
			animationTrack.AdjustSpeed(speed);
		}
	}

	public StopAnimation(name: string, fadeTime?: number) {
		for (const [_, groupAnimationsTracks] of pairs(this.animationTracks)) {
			const animationTracks = groupAnimationsTracks.get(name);
			if (!animationTracks) {
				continue;
			}

			const animationTrack = this.ChooseAnimationTrack(animationTracks) as AnimationTrack;
			if (!animationTrack) continue;

			animationTrack.Stop(fadeTime);
		}
	}

	constructor(character: Model, viewmodel?: Model | undefined ) {
		this.rigs = {
			character: character,
			viewmodel: viewmodel,
		};
	}

	public Destroy(fadeTime: number = 0) {
		this.UnloadAnimations(fadeTime);
	}
}
