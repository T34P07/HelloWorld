import { Node } from "client/render_pipeline/Node";
import CharacterService from "client/services/CharacterService";
import { CameraNodeInputType } from "shared/types/NodeTypes";
import { lerp } from "shared/utilities/MathUtilities";

const Workspace = game.GetService("Workspace");

const UserInputService = game.GetService("UserInputService");
const UserGameSettings = UserSettings().GetService("UserGameSettings");

export class CameraSway extends Node {
	private rot = Vector2.zero;

	PreUpdate(dt: number): void {
		const mouseDelta = UserInputService.GetMouseDelta();
		const swayFactor = 3;

		this.rot = this.rot.Lerp(
			new Vector2(
				math.rad(math.clamp(mouseDelta.X, -swayFactor, swayFactor)),
				math.rad(math.clamp(mouseDelta.Y, -swayFactor, swayFactor)),
			),
			10 * dt,
		);
	}

	Update<T>(dt: number, input: T): T {
		if (!CharacterService.hrp || !CharacterService.head || !CharacterService.hum) return input;
		const output = input as CameraNodeInputType;

		output.camera.cf = output.camera.cf.mul(CFrame.Angles(this.rot.Y, 0, this.rot.X));

		return output as T;
	}
}
