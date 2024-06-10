import RunConfig from "client/config/RunConfig";

export class CharacterAnimator {
	private character;
	private humanoid;
	private animator;
	private pose = "Idle";
	private transitionTime: number = 0.25;
	private lastJump: number = 0;
	private jumpVar: number = 1;
	private lastUpdate: number = 0;
	private jumpAnimDuration: number = 1;
	private animationTracks: Map<string, AnimationTrack[]> = new Map<string, AnimationTrack[]>();
	private animationTrack: AnimationTrack | undefined;

	public LoadAnimations(animations: Folder) {
		animations.GetDescendants().forEach((animation) => {
			if (!animation.IsA("Animation") || !this.animator) return;

			let animationTracks = this.animationTracks.get(animation.Name);
			animationTracks = animationTracks ? animationTracks : [];
			this.animationTracks.set(animation.Name, animationTracks);

			const animationTrack = this.animator.LoadAnimation(animation);
			const weight = animation.GetAttribute("Weight") as number;

			if (weight) animationTrack.AdjustWeight(weight);

			animationTracks.push(animationTrack);
			print(animationTracks);
		});

		if (this.pose === "Standing") this.PlayAnimation("Idle");
	}

	public UnloadAnimations(animations: Folder) {
		for (const animationPairs of pairs(this.animationTracks)) {
			const [animationName, animationTracks] = animationPairs;

			animationTracks.forEach((animationTrack, index) => {
				if (animationTrack.Animation && animationTrack.Animation.IsDescendantOf(animations)) {
					animationTrack.Stop();
					animationTracks.remove(index);
				}

				return;
			});
		}

		if (this.pose === "Standing") this.PlayAnimation("Idle");
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

	private PlayAnimation(name: string, transitionTime?: number) {
		transitionTime = transitionTime ?? this.transitionTime;

		const animationTracks = this.animationTracks.get(name);
		if (!animationTracks) return;

		const animationTrack = this.GetAnimationTrack(animationTracks) as AnimationTrack;
		if (!animationTrack) return;

		if (animationTrack !== this.animationTrack) {
			if (this.animationTrack) this.animationTrack.Stop(transitionTime);

			animationTrack.Play(transitionTime);
			this.animationTrack = animationTrack;
		}

		return animationTrack;
	}

	private StopAllAnimations() {
		for (const animationPairs of pairs(this.animationTracks)) {
			const [animationName, animationTracks] = animationPairs;

			animationTracks.forEach((animationTrack) => {
				animationTrack.Stop();
			});
		}
	}

	private UnloadAllAnimations() {
		this.StopAllAnimations();
		this.animationTracks = new Map<string, AnimationTrack[]>();
	}

	private OnRunning(speed: number) {
		if (!this.character) return;
		speed /= this.character.GetScale();

		if (speed > 0.1) {
			const animationTrack = this.PlayAnimation("Run");

			if (animationTrack) animationTrack.AdjustSpeed(speed / RunConfig.Speed);

			this.pose = "Running";
		} else {
			this.PlayAnimation("Idle");
			this.pose = "Standing";
		}
	}

	private OnDied() {
		this.pose = "Dead";
	}

	private OnJumping() {
		const now = os.clock();
		if (!this.humanoid || now - this.lastJump <= this.transitionTime) return;
		this.lastJump = now;

		let jumpAnim = this.humanoid.GetAttribute("JumpAnim") as string;
		jumpAnim = jumpAnim ? jumpAnim : "Jump";

		if (jumpAnim === "Jump" || jumpAnim === "LongJump") {
			jumpAnim += this.jumpVar;
			this.jumpVar = 3 - this.jumpVar;
		}

		this.PlayAnimation(jumpAnim);
		this.humanoid.SetAttribute("JumpAnim", undefined);
		this.pose = "Jumping";
	}

	private OnClimbing(speed: number) {
		if (!this.character) return;
		speed /= this.character.GetScale();

		const animationTrack = this.PlayAnimation("Climb");
		if (animationTrack) animationTrack.AdjustSpeed(speed / 12);
		this.pose = "Climbing";
	}

	private OnGettingUp() {
		this.pose = "GettingUp";
	}

	private OnFreeFall() {
		const now = os.clock();

		if (now - this.lastJump >= this.jumpAnimDuration) this.PlayAnimation("Fall");
		this.pose = "FreeFall";
	}

	private OnFallingDown() {
		this.pose = "FallingDown";
	}

	private OnSeated() {
		this.pose = "Seated";
	}

	private OnPlatformStanding() {
		this.pose = "PlatformStanding";
	}

	private OnSwimming(speed: number) {
		if (speed > 0) this.pose = "Running";
		else this.pose = "Standing";
	}

	public Update() {
		if (!this.character) return;

		const now = os.clock();
		if (now - this.lastUpdate < 0.1) return;
		this.lastUpdate = now;

		if (this.pose === "FreeFall" && now - this.lastJump >= this.jumpAnimDuration) this.PlayAnimation("Fall");
		else if (this.pose === "Seated") {
			this.PlayAnimation("Sit");
			return;
		} else if (this.pose === "Running") this.PlayAnimation("Run");
		else if (
			this.pose === "Dead" ||
			this.pose === "GettingUp" ||
			this.pose === "FallingDown" ||
			this.pose === "Seated" ||
			this.pose === "PlatformStanding"
		)
			this.StopAllAnimations();
	}

	constructor(character: Model) {
		this.UnloadAllAnimations();

		this.character = character;
		this.humanoid = this.character.WaitForChild("Humanoid") as Humanoid;
		this.animator = this.humanoid.WaitForChild("Animator") as Animator;

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
