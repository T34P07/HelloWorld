import { AnimationServiceType } from "shared/types/ServiceType";
import { RunService } from "@rbxts/services";

import RunConfig from "client/config/RunConfig";

const AnimationService: AnimationServiceType = {
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
			if (!animation.IsA("Animation") || !AnimationService.animator) return;

			AnimationService.animationTracks[animation.Name] = AnimationService.animationTracks[animation.Name] || {};

			const animationTrack = AnimationService.animator.LoadAnimation(animation);
			const weight = animation.GetAttribute("Weight") as number;

			if (weight) animationTrack.AdjustWeight(weight);

			AnimationService.animationTracks[animation.Name].push(animationTrack);
		});

		if (AnimationService.pose === "Standing") AnimationService.PlayAnimation("Idle");
	},
	UnloadAnimations: (animations) => {
		for (const animationPairs of pairs(AnimationService.animationTracks)) {
			const [animationName, animationTracks] = animationPairs;

			animationTracks.forEach((animationTrack, index) => {
				if (animationTrack.Animation && animationTrack.Animation.IsDescendantOf(animations)) {
					animationTrack.Stop();
					animationTracks.remove(index);
				}

				return;
			});
		}

		if (AnimationService.pose === "Standing") AnimationService.PlayAnimation("Idle");
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
		transitionTime = transitionTime ?? AnimationService.transitionTime;

		const animationTracks = AnimationService.animationTracks[name];
		if (!animationTracks) return;

		const animationTrack = AnimationService.GetAnimationTrack(animationTracks) as AnimationTrack;
		if (!animationTrack) return;

		if (animationTrack !== AnimationService.animationTrack) {
			if (AnimationService.animationTrack) AnimationService.animationTrack.Stop(transitionTime);

			animationTrack.Play(transitionTime);
			AnimationService.animationTrack = animationTrack;
		}

		return animationTrack;
	},
	StopAllAnimations: () => {
		for (const animationPairs of pairs(AnimationService.animationTracks)) {
			const [animationName, animationTracks] = animationPairs;

			animationTracks.forEach((animationTrack) => {
				animationTrack.Stop();
			});
		}
	},
	UnloadAllAnimations: () => {
		AnimationService.StopAllAnimations();
		AnimationService.animationTracks = {};
	},
	OnRunning: (speed) => {
		if (!AnimationService.figure) return;
		speed /= AnimationService.figure.GetScale();

		if (speed > 0.1) {
			const animationTrack = AnimationService.PlayAnimation("Run");

			if (animationTrack) animationTrack.AdjustSpeed(speed / RunConfig.Speed);

			AnimationService.pose = "Running";
		} else {
			AnimationService.PlayAnimation("Idle");
			AnimationService.pose = "Standing";
		}
	},
	OnDied: () => {
		AnimationService.pose = "Dead";
	},
	OnJumping: () => {
		const now = os.clock();
		if (!AnimationService.humanoid || now - AnimationService.lastJump <= AnimationService.transitionTime) return;
		AnimationService.lastJump = now;

		let jumpAnim = AnimationService.humanoid.GetAttribute("JumpAnim") as string;
		jumpAnim = jumpAnim ? jumpAnim : "Jump";

		if (jumpAnim === "Jump" || jumpAnim === "LongJump") {
			jumpAnim += AnimationService.jumpVar;
			AnimationService.jumpVar = 3 - AnimationService.jumpVar;
		}

		AnimationService.PlayAnimation(jumpAnim);
		AnimationService.humanoid.SetAttribute("JumpAnim", undefined);
		AnimationService.pose = "Jumping";
	},
	OnClimbing: (speed: number) => {
		if (!AnimationService.figure) return;
		speed /= AnimationService.figure.GetScale();

		const animationTrack = AnimationService.PlayAnimation("Climb");
		if (animationTrack) animationTrack.AdjustSpeed(speed / 12);
		AnimationService.pose = "Climbing";
	},
	OnGettingUp: () => {
		AnimationService.pose = "GettingUp";
	},
	OnFreeFall: () => {
		const now = os.clock();

		if (now - AnimationService.lastJump >= AnimationService.jumpAnimDuration)
			AnimationService.PlayAnimation("Fall");
		AnimationService.pose = "FreeFall";
	},
	OnFallingDown: () => {
		AnimationService.pose = "FallingDown";
	},
	OnSeated: () => {
		AnimationService.pose = "Seated";
	},
	OnPlatformStanding: () => {
		AnimationService.pose = "PlatformStanding";
	},
	OnSwimming: (speed) => {
		if (speed > 0) AnimationService.pose = "Running";
		else AnimationService.pose = "Standing";
	},
	Update: () => {
		if (!AnimationService.figure) return;

		const now = os.clock();
		if (now - AnimationService.lastUpdate < 0.1) return;
		AnimationService.lastUpdate = now;

		if (
			AnimationService.pose === "FreeFall" &&
			now - AnimationService.lastJump >= AnimationService.jumpAnimDuration
		)
			AnimationService.PlayAnimation("Fall");
		else if (AnimationService.pose === "Seated") {
			AnimationService.PlayAnimation("Sit");
			return;
		} else if (AnimationService.pose === "Running") AnimationService.PlayAnimation("Run");
		else if (
			AnimationService.pose === "Dead" ||
			AnimationService.pose === "GettingUp" ||
			AnimationService.pose === "FallingDown" ||
			AnimationService.pose === "Seated" ||
			AnimationService.pose === "PlatformStanding"
		)
			AnimationService.StopAllAnimations();
	},
	SetFigure: (figure) => {
		AnimationService.UnloadAllAnimations();

		AnimationService.figure = figure;
		AnimationService.humanoid = AnimationService.figure.WaitForChild("Humanoid") as Humanoid;
		AnimationService.animator = AnimationService.humanoid.WaitForChild("Animator") as Animator;

		AnimationService.humanoid.Died.Connect(AnimationService.OnDied);
		AnimationService.humanoid.Running.Connect(AnimationService.OnRunning);
		AnimationService.humanoid.Jumping.Connect(AnimationService.OnJumping);
		AnimationService.humanoid.Climbing.Connect(AnimationService.OnClimbing);
		AnimationService.humanoid.GettingUp.Connect(AnimationService.OnGettingUp);
		AnimationService.humanoid.FreeFalling.Connect(AnimationService.OnFreeFall);
		AnimationService.humanoid.FallingDown.Connect(AnimationService.OnFallingDown);
		AnimationService.humanoid.Seated.Connect(AnimationService.OnSeated);
		AnimationService.humanoid.PlatformStanding.Connect(AnimationService.OnPlatformStanding);
		AnimationService.humanoid.Swimming.Connect(AnimationService.OnSwimming);
	},
	Start: () => {
		RunService.PreAnimation.Connect(AnimationService.Update);
	},
};

export default AnimationService;
