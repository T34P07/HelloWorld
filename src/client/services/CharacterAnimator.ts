import RunConfig from "client/config/RunConfig";

type AnimationTracks = {
	character: Map<string, AnimationTrack[]>;
	viewmodel: Map<string, AnimationTrack[]>;
};

type Rigs = {
	character: Model | undefined;
	viewmodel: Model | undefined;
};

type RigName = "viewmodel" | "character";

export class CharacterAnimator {
	private humanoid;
	private rigs: Rigs = {
		character: undefined,
		viewmodel: undefined,
	};
	private pose = "Idle";
	private lastPose: string = "";
	private fadeTime: number = 0.2;
	private lastJump: number = 0;
	private jumpVar: number = 1;
	private lastUpdate: number = 0;
	private jumpAnimDuration: number = 1;
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

		this.ReloadAnimations();
	}

	public UnloadAnimations(animations: Folder) {
		for (const [_, groupAnimationsTracks] of pairs(this.animationTracks)) {
			for (const animationPairs of pairs(groupAnimationsTracks)) {
				const [_, animationTracks] = animationPairs;

				animationTracks.forEach((animationTrack, index) => {
					if (animationTrack.Animation && animationTrack.Animation.IsDescendantOf(animations)) {
						animationTrack.Stop();
						animationTracks.remove(index);
					}

					return;
				});
			}
		}

		this.ReloadAnimations();
	}

	private GetAnimationTrack(animationTracks: AnimationTrack[]) {
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

	private PlayAnimation(name: string, fadeTime: number = this.fadeTime) {
		if (name === this.lastPose) return;
		this.StopAnimation(this.lastPose, fadeTime);
		this.lastPose = name;

		for (const [_, groupAnimationsTracks] of pairs(this.animationTracks)) {
			const animationTracks = groupAnimationsTracks.get(name);
			if (!animationTracks) continue;

			const animationTrack = this.GetAnimationTrack(animationTracks) as AnimationTrack;
			if (!animationTrack) continue;

			animationTrack.Play(fadeTime);
		}
	}

	private StopAnimation(name: string, fadeTime?: number) {
		for (const [_, groupAnimationsTracks] of pairs(this.animationTracks)) {
			const animationTracks = groupAnimationsTracks.get(name);
			if (!animationTracks) {
				continue;
			}

			const animationTrack = this.GetAnimationTrack(animationTracks) as AnimationTrack;
			if (!animationTrack) continue;

			animationTrack.Stop(fadeTime);
		}
	}

	private AdjustAnimationSpeed(name: string, speed: number) {
		for (const [_, groupAnimationsTracks] of pairs(this.animationTracks)) {
			for (const animationPairs of pairs(groupAnimationsTracks)) {
				const [_, animationTracks] = animationPairs;

				const animationTrack = this.GetAnimationTrack(animationTracks) as AnimationTrack;
				if (!animationTrack) continue;

				animationTrack.AdjustSpeed(speed);
			}
		}
	}

	private StopAllAnimations() {
		for (const [_, animationsTracksGroup] of pairs(this.animationTracks)) {
			for (const animationPairs of pairs(animationsTracksGroup)) {
				const [_, animationTracks] = animationPairs;

				animationTracks.forEach((animationTrack) => {
					animationTrack.Stop();
				});
			}
		}

		this.pose = "";
		this.lastPose = "";
	}

	private ReloadAnimations() {
		const pose = this.pose;
		this.StopAllAnimations();
		this.pose = pose;
		this.PlayAnimation(pose);
	}

	private UnloadAllAnimations() {
		this.StopAllAnimations();

		this.animationTracks = {
			character: new Map<string, AnimationTrack[]>(),
			viewmodel: new Map<string, AnimationTrack[]>(),
		};
	}

	private OnRunning(speed: number) {
		if (!this.rigs.character) return;
		speed /= this.rigs.character.GetScale();

		if (speed > 0.1) {
			this.pose = "Run";
			this.PlayAnimation("Run");
			this.AdjustAnimationSpeed("Run", speed / RunConfig.Speed);
		} else {
			this.pose = "Idle";
			this.PlayAnimation("Idle");
		}
	}

	private OnDied() {
		this.pose = "Dead";
	}

	private OnJumping() {
		const now = os.clock();
		if (!this.humanoid || now - this.lastJump <= this.fadeTime) return;
		this.lastJump = now;

		let jumpAnim = this.humanoid.GetAttribute("JumpAnim") as string;
		jumpAnim = jumpAnim ? jumpAnim : "Jump";

		if (jumpAnim === "Jump" || jumpAnim === "LongJump") {
			jumpAnim += this.jumpVar;
			this.jumpVar = 3 - this.jumpVar;
		}

		this.pose = "Jump";
		this.humanoid.SetAttribute("JumpAnim", undefined);
		this.PlayAnimation(jumpAnim);
	}

	private OnClimbing(speed: number) {
		if (!this.rigs.character) return;
		speed /= this.rigs.character.GetScale();

		this.pose = "Climb";
		this.PlayAnimation("Climb");
		this.AdjustAnimationSpeed("Climb", speed / 12);
	}

	private OnGettingUp() {
		this.pose = "GetUp";
	}

	private OnFreeFall() {
		const now = os.clock();
		if (now - this.lastJump >= this.jumpAnimDuration) {
			this.PlayAnimation("FreeFall");
		}

		this.pose = "FreeFall";
	}

	private OnFallingDown() {
		this.pose = "FallDown";
	}

	private OnSeated() {
		this.pose = "Sit";
	}

	private OnPlatformStanding() {
		this.pose = "PlatformStand";
	}

	private OnSwimming(speed: number) {
		if (speed > 0) this.pose = "Run";
		else this.pose = "Idle";
	}

	public Update() {
		if (!this.rigs.character) return;

		const now = os.clock();
		if (now - this.lastUpdate < 0.1) return;
		this.lastUpdate = now;
		if (this.pose === "FreeFall" && now - this.lastJump >= this.jumpAnimDuration) {
			this.PlayAnimation("FreeFall");
		} else if (this.pose === "Sit") {
			this.PlayAnimation("Sit");
			return;
		} else if (this.pose === "Run") this.PlayAnimation("Run");
		else if (
			this.pose === "Dead" ||
			this.pose === "GetUp" ||
			this.pose === "FallDown" ||
			this.pose === "Sit" ||
			this.pose === "PlatformStand"
		)
			this.StopAllAnimations();
	}

	constructor(character: Model, viewmodel?: Model | undefined) {
		this.UnloadAllAnimations();

		this.humanoid = character.WaitForChild("Humanoid") as Humanoid;

		this.rigs = {
			character: character,
			viewmodel: viewmodel,
		};

		this.humanoid.Died.Connect(() => this.OnDied());
		this.humanoid.Running.Connect((speed: number) => this.OnRunning(speed));
		this.humanoid.Jumping.Connect(() => this.OnJumping());
		this.humanoid.Climbing.Connect((speed: number) => this.OnClimbing(speed));
		this.humanoid.GettingUp.Connect(() => this.OnGettingUp());
		this.humanoid.FreeFalling.Connect(() => this.OnFreeFall());
		this.humanoid.FallingDown.Connect(() => this.OnFallingDown());
		this.humanoid.Seated.Connect(() => this.OnSeated());
		this.humanoid.PlatformStanding.Connect(() => this.OnPlatformStanding());
		this.humanoid.Swimming.Connect((speed: number) => this.OnSwimming(speed));

		return this;
	}

	Destroy() {
		this.UnloadAllAnimations();
	}
}
