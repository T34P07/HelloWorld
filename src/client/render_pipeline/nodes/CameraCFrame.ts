import { Node } from "../Node";
import CharacterService from "client/CharacterService";

const UserInputService = game.GetService("UserInputService");
const UserGameSettings = UserSettings().GetService("UserGameSettings");

const Vector3xyAxis = Vector3.xAxis.add(Vector3.yAxis);

export class CameraCFrame extends Node {
	private lastOutput = new CFrame();
	private lastOffset = Vector3.zero;
	private rot = Vector2.zero;

	PreUpdate(dt: number): void {
		const mouseDelta = UserInputService.GetMouseDelta();
		const mouseSensitivity = UserGameSettings.MouseSensitivity;

		this.rot = new Vector2(
			this.rot.X - mouseDelta.X * mouseSensitivity * 0.025,
			math.clamp(this.rot.Y - mouseDelta.Y * mouseSensitivity * 0.025, -math.rad(80), math.rad(80)),
		);
	}

	Update<T>(dt: number, input: T, mode: number): T {
		if (!CharacterService.hrp || !CharacterService.head || !CharacterService.hum) return input;

		const hrpCF = CharacterService.hrp.CFrame as CFrame;
		let output = input as CFrame;

		if (mode === 1) {
			let raw = new CFrame(output.Position);
			let offset = this.lastOffset.Lerp(CharacterService.hum.CameraOffset, dt * 10);
			this.lastOffset = offset;

			offset = hrpCF.RightVector.mul(offset.X).add(
				hrpCF.UpVector.mul(offset.Y).add(hrpCF.LookVector.mul(offset.Z)),
			);

			const [hrpY, hrpX, hrpZ] = hrpCF.ToOrientation();
			raw = output.add(offset).mul(CFrame.Angles(-hrpY, -hrpX, -hrpZ));

			const rot = CFrame.Angles(0, this.rot.X, 0).mul(CFrame.Angles(this.rot.Y, 0, 0));
			output = raw.mul(rot);
		}

		return output as T;
	}
}
