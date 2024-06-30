import InputService from "client/services/InputService";
import { WeaponTag } from "./WeaponTag";
import { Workspace } from "@rbxts/services";
import CharacterService from "client/services/CharacterService";
import Events from "client/modules/Events";

export class MeleeTag extends WeaponTag {
	private collider: BasePart | undefined;
	private combo = 1;
	private inputQueued = 0;
	private action = "None";
	private comboTrove = this.actionTrove.extend();

	private DetectHit(animationName: string) {
		this.collider = this.viewmodelTool!.FindFirstChild("Colliders")!.FindFirstChild(animationName, true) as Part;
		const humanoidsHit = [] as Humanoid[];

		const parts = Workspace.GetPartsInPart(this.collider, CharacterService.noCharOverlapParams);

		parts.forEach((instance: Instance) => {
			const humanoid = (instance.Parent!.FindFirstChild("Humanoid") ??
				instance.Parent!.Parent!.FindFirstChild("Humanoid")) as Humanoid;
			if (!humanoid) return;

			if (!humanoidsHit.includes(humanoid)) {
				humanoidsHit.push(humanoid);
			}
		});

		Events.Weapons.Damage.Deal.SendToServer(humanoidsHit);
	}

	private ProceedCombo() {
		this.inputQueued = 0;

		const animationName = `Attack${this.combo}`;

		const groupAnimationTracks = this.actionAnimator!.GetGroupAnimationTracks(animationName);
		if (!groupAnimationTracks.viewmodel) return false;

		let endConnection: RBXScriptConnection | undefined = undefined;

		this.comboTrove.add(groupAnimationTracks.viewmodel.GetMarkerReachedSignal("Meta").Once(() => {
			if (os.clock() - this.inputQueued < .5) {
				this.combo++;
				if (this.ProceedCombo())
					if (endConnection)
						endConnection.Disconnect();
				this.actionAnimator!.StopAnimation(animationName);
			}
		}));

		this.comboTrove.add(groupAnimationTracks.viewmodel.GetMarkerReachedSignal("Hit").Once(() => {
			this.DetectHit(animationName);
		}));

		endConnection = groupAnimationTracks.viewmodel.Ended.Once(() => {
			this.action = "None";
			this.comboTrove.clean();
		});
		this.comboTrove.add(endConnection);

		this.actionAnimator!.PlayAnimation(animationName, .1, 1.5);
		return true;
	};

	protected StopCombo() {
		this.comboTrove.clean();
		for (let index = 1; index <= this.combo; index++) {
			this.actionAnimator!.StopAnimation(`Attack${this.combo}`, 0);
		}
		return true;
	}

	protected Attack() {
		if (this.action !== "None") return;
		this.action = "Attack";

		this.combo = 1;
		this.ProceedCombo();
	};

	protected Block(userInputState: Enum.UserInputState) {
		if (userInputState === Enum.UserInputState.Begin) {
			if (this.action !== "None" && (this.action !== "Attack" || !this.StopCombo()))
				return;

			this.action = "Block";
			this.actionAnimator!.PlayAnimation("Block", .15);
		}
		else if (this.action === "Block" && userInputState === Enum.UserInputState.End) {
			this.actionAnimator!.StopAnimation("Block", .15);
			this.action = "None";
		}
	};

	protected Equipped(): boolean {
		if (!super.Equipped()) return false;

		this.actionTrove.connect(InputService.BindAction("Attack"), (_, userInputState: Enum.UserInputState) => {
			if (userInputState !== Enum.UserInputState.Begin) return;

			this.inputQueued = os.clock();
			this.Attack();
		});

		this.actionTrove.connect(InputService.BindAction("Block"), (_, userInputState: Enum.UserInputState) => {
			this.Block(userInputState);
		});

		this.action = "None";

		return true;
	}

	protected Unequipped(): void {
		super.Unequipped();
	}

	constructor(instance: Instance, toolclass: string) {
		super(instance, toolclass);
	};

	Destroy() {
		super.Destroy();
	}
}
