const Workspace = game.GetService("Workspace");
const ReplicatedStorage = game.GetService("ReplicatedStorage");
const RunService = game.GetService("RunService");
const Prefabs = ReplicatedStorage.WaitForChild("Prefabs");

import Run from "./config/Run";

type AnimationManager = {
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

const AnimationManager: AnimationManager = {
	animationTracks: {},
	pose: "Idle",
	animationTrack: undefined,
	figure: undefined,
	humanoid: undefined,
	animator: undefined,
	transitionTime: 0.25,
	lastJump: 0,
	jumpVar: 1,
	lastUpdate: 0,
	jumpAnimDuration: 1,
	LoadAnimations: (animations) => {
		animations.GetDescendants().forEach((animation) => {
			if (!animation.IsA("Animation") || !AnimationManager.animator) return;

			AnimationManager.animationTracks[animation.Name] = AnimationManager.animationTracks[animation.Name] || {};

			const animationTrack = AnimationManager.animator.LoadAnimation(animation);
			const weight = animation.GetAttribute("Weight") as number;

			if (weight) animationTrack.AdjustWeight(weight);

			AnimationManager.animationTracks[animation.Name].push(animationTrack);
		});

		if (AnimationManager.pose === "Standing") AnimationManager.PlayAnimation("Idle");
	},
	UnloadAnimations: (animations) => {
		for (const animationPairs of pairs(AnimationManager.animationTracks)) {
			const [animationName, animationTracks] = animationPairs;

			animationTracks.forEach((animationTrack, index) => {
				if (animationTrack.Animation && animationTrack.Animation.IsDescendantOf(animations)) {
					animationTrack.Stop();
					animationTracks.remove(index);
				}

				return;
			});
		}

		if (AnimationManager.pose === "Standing") AnimationManager.PlayAnimation("Idle");
	},
	GetAnimationTrack: (animationTracks: AnimationTrack[]) => {
		let lastWeight = 0;
		let lastAnimationTrack: AnimationTrack | undefined;

		animationTracks.forEach((animationTrack) => {
			let weight = animationTrack.Animation!.GetAttribute("Weight") as number;
			weight = weight ?? 0;

			if (!lastAnimationTrack || weight > lastWeight) {
				lastWeight = weight;
				lastAnimationTrack = animationTrack;
			}
		});

		return lastAnimationTrack;
	},
	PlayAnimation: (name, transitionTime) => {
		transitionTime = transitionTime ?? AnimationManager.transitionTime;

		const animationTracks = AnimationManager.animationTracks[name];
		if (!animationTracks) return;

		const animationTrack = AnimationManager.GetAnimationTrack(animationTracks) as AnimationTrack;
		if (!animationTrack) return;

		if (animationTrack !== AnimationManager.animationTrack) {
			if (AnimationManager.animationTrack) AnimationManager.animationTrack.Stop(transitionTime);

			animationTrack.Play(transitionTime);
			AnimationManager.animationTrack = animationTrack;
		}

		return animationTrack;
	},
	StopAllAnimations: () => {
		for (const animationPairs of pairs(AnimationManager.animationTracks)) {
			const [animationName, animationTracks] = animationPairs;

			animationTracks.forEach((animationTrack) => {
				animationTrack.Stop();
			});
		}
	},
	UnloadAllAnimations: () => {
		AnimationManager.StopAllAnimations();
		AnimationManager.animationTracks = {};
	},
	OnRunning: (speed) => {
		if (!AnimationManager.figure) return;
		speed /= AnimationManager.figure.GetScale();

		if (speed > 0.1) {
			const animationTrack = AnimationManager.PlayAnimation("Run");

			if (animationTrack) animationTrack.AdjustSpeed(speed / Run.Speed);

			AnimationManager.pose = "Running";
		} else {
			AnimationManager.PlayAnimation("Idle");
			AnimationManager.pose = "Standing";
		}
	},
	OnDied: () => {
		AnimationManager.pose = "Dead";
	},
	OnJumping: () => {
		const now = os.clock();
		if (!AnimationManager.humanoid || now - AnimationManager.lastJump <= AnimationManager.transitionTime) return;
		AnimationManager.lastJump = now;

		let jumpAnim = AnimationManager.humanoid.GetAttribute("JumpAnim") as string;
		jumpAnim = jumpAnim ? jumpAnim : "Jump";

		if (jumpAnim === "Jump" || jumpAnim === "LongJump") {
			jumpAnim += AnimationManager.jumpVar;
			AnimationManager.jumpVar = 3 - AnimationManager.jumpVar;
		}

		AnimationManager.PlayAnimation(jumpAnim);
		AnimationManager.humanoid.SetAttribute("JumpAnim", undefined);
		AnimationManager.pose = "Jumping";
	},
	OnClimbing: (speed: number) => {
		if (!AnimationManager.figure) return;
		speed /= AnimationManager.figure.GetScale();

		const animationTrack = AnimationManager.PlayAnimation("Climb");
		if (animationTrack) animationTrack.AdjustSpeed(speed / 12);
		AnimationManager.pose = "Climbing";
	},
	OnGettingUp: () => {
		AnimationManager.pose = "GettingUp";
	},
	OnFreeFall: () => {
		const now = os.clock();

		if (now - AnimationManager.lastJump >= AnimationManager.jumpAnimDuration)
			AnimationManager.PlayAnimation("Fall");
		AnimationManager.pose = "FreeFall";
	},
	OnFallingDown: () => {
		AnimationManager.pose = "FallingDown";
	},
	OnSeated: () => {
		AnimationManager.pose = "Seated";
	},
	OnPlatformStanding: () => {
		AnimationManager.pose = "PlatformStanding";
	},
	OnSwimming: (speed) => {
		if (speed > 0) AnimationManager.pose = "Running";
		else AnimationManager.pose = "Standing";
	},
	Update: () => {
		if (!AnimationManager.figure) return;

		const now = os.clock();
		if (now - AnimationManager.lastUpdate < 0.1) return;
		AnimationManager.lastUpdate = now;

		if (
			AnimationManager.pose === "FreeFall" &&
			now - AnimationManager.lastJump >= AnimationManager.jumpAnimDuration
		)
			AnimationManager.PlayAnimation("Fall");
		else if (AnimationManager.pose === "Seated") {
			AnimationManager.PlayAnimation("Sit");
			return;
		} else if (AnimationManager.pose === "Running") AnimationManager.PlayAnimation("Run");
		else if (
			AnimationManager.pose === "Dead" ||
			AnimationManager.pose === "GettingUp" ||
			AnimationManager.pose === "FallingDown" ||
			AnimationManager.pose === "Seated" ||
			AnimationManager.pose === "PlatformStanding"
		)
			AnimationManager.StopAllAnimations();
	},
	SetFigure: (figure) => {
		AnimationManager.UnloadAllAnimations();

		AnimationManager.figure = figure;
		AnimationManager.humanoid = AnimationManager.figure.WaitForChild("Humanoid") as Humanoid;
		AnimationManager.animator = AnimationManager.humanoid.WaitForChild("Animator") as Animator;

		AnimationManager.humanoid.Died.Connect(AnimationManager.OnDied);
		AnimationManager.humanoid.Running.Connect(AnimationManager.OnRunning);
		AnimationManager.humanoid.Jumping.Connect(AnimationManager.OnJumping);
		AnimationManager.humanoid.Climbing.Connect(AnimationManager.OnClimbing);
		AnimationManager.humanoid.GettingUp.Connect(AnimationManager.OnGettingUp);
		AnimationManager.humanoid.FreeFalling.Connect(AnimationManager.OnFreeFall);
		AnimationManager.humanoid.FallingDown.Connect(AnimationManager.OnFallingDown);
		AnimationManager.humanoid.Seated.Connect(AnimationManager.OnSeated);
		AnimationManager.humanoid.PlatformStanding.Connect(AnimationManager.OnPlatformStanding);
		AnimationManager.humanoid.Swimming.Connect(AnimationManager.OnSwimming);
	},
	Start: () => {
		RunService.PreAnimation.Connect(AnimationManager.Update);
	},
};

export default AnimationManager;
