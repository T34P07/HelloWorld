import { Players, RunService } from "@rbxts/services";
import { Node } from "client/render_pipeline/Node";
import { CameraNodeInputType } from "client/types/node_types/CameraNodeInputType";

export class ViewmodelBobble extends Node {
	private bobble = new CFrame();
	private time = 0;
	private frequency = 2;
	private amplitude = 0.75;

	PreUpdate(dt: number): void {
		const localPlayer = Players.LocalPlayer;
		const character = localPlayer.Character;
		if (!character || !character.PrimaryPart) return;

		const speed = character.PrimaryPart.AssemblyLinearVelocity.Magnitude;
		const swayMultiplier = speed * 0.1;

		this.time += dt * speed * 0.1;
		const bobX = math.sin(this.time * this.frequency) * this.amplitude;
		const bobY = math.cos(this.time * this.frequency * 2) * this.amplitude;

		if (speed < 1) {
			this.bobble = this.bobble.Lerp(
				new CFrame().mul(CFrame.Angles(math.cos(os.clock()) * 0.025, math.sin(os.clock()) * 0.025, 0)),
				dt * 10,
			);

			return;
		}

		const swayCFrame =
			speed < 1
				? new CFrame()
				: new CFrame(bobX, bobY, 0).mul(
						CFrame.Angles(math.rad(bobY * swayMultiplier) / 2, 0, math.rad(bobX * swayMultiplier)),
					);

		this.bobble = this.bobble.Lerp(swayCFrame, dt * 5);
	}

	Update<T>(dt: number, input: T): T {
		const output = input as CameraNodeInputType;

		output.viewmodel.cf = output.viewmodel.cf.mul(this.bobble);

		return output as T;
	}
}
