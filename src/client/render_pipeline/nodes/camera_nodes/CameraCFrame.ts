import CameraConfig from "client/config/CameraConfig";
import { Node } from "../../Node";
import CharacterService from "client/services/CharacterService";
import { CameraNodeInputType } from "client/types/node_types/CameraNodeInputType";
import { Workspace, UserInputService } from "@rbxts/services";

const UserGameSettings = UserSettings().GetService("UserGameSettings");

const camera = Workspace.CurrentCamera;

export class CameraCFrame extends Node {
	private lastOutput = new CFrame();
	private lastOffset = Vector3.zero;
	private rot = Vector2.zero;

	PreUpdate(dt: number): void {
		const mouseDelta = UserInputService.GetMouseDelta();
		const mouseSensitivity = UserGameSettings.MouseSensitivity;

		this.rot = new Vector2(
			this.rot.X - mouseDelta.X * mouseSensitivity * 0.025,
			math.clamp(this.rot.Y - mouseDelta.Y * mouseSensitivity * 0.025, -CameraConfig.Clamp, CameraConfig.Clamp),
		);

		camera!.SetAttribute("OrbitalAxis", this.rot);
	}

	Update<T>(dt: number, input: T): T {
		if (!CharacterService.hrp || !CharacterService.head || !CharacterService.hum) return input;

		const [mode, submode] = [camera!.GetAttribute("Mode") as number, camera!.GetAttribute("SubMode") as number];

		const hrpCF = CharacterService.hrp.CFrame as CFrame;
		const output = input as CameraNodeInputType;

		const modeConfig = CameraConfig.Modes[mode];
		const subModeConfig = modeConfig.SubModes[submode];

		if (mode === 0) {
			let raw = new CFrame(output.camera.cf.Position);
			let offset = this.lastOffset.Lerp(CharacterService.hum.CameraOffset, dt * 10);
			this.lastOffset = offset;

			offset = hrpCF.RightVector.mul(offset.X).add(
				hrpCF.UpVector.mul(offset.Y).add(hrpCF.LookVector.mul(offset.Z)),
			);

			const [hrpY, hrpX, hrpZ] = hrpCF.ToOrientation();
			raw = output.camera.cf.add(offset).mul(CFrame.Angles(-hrpY, -hrpX, -hrpZ));

			const rot = CFrame.Angles(0, this.rot.X, 0).mul(CFrame.Angles(this.rot.Y, 0, 0));
			output.camera.cf = raw.mul(rot);
		} else {
			let raw = new CFrame(hrpCF.Position);

			const offset = this.lastOffset.Lerp(
				new Vector3(subModeConfig.Offset.X, subModeConfig.Offset.Y, 0),
				10 * dt,
			);
			this.lastOffset = offset;

			const offsetFromCharacter = hrpCF.RightVector.mul(offset.X).add(hrpCF.UpVector.mul(offset.Y));

			raw = raw.add(offsetFromCharacter);

			const t = modeConfig.Responsiveness > 0 ? modeConfig.Responsiveness * dt : 1;
			const rot = CFrame.Angles(0, this.rot.X, 0).mul(CFrame.Angles(this.rot.Y, 0, 0));

			output.camera.cf = this.lastOutput.Lerp(
				raw.mul(rot).mul(new CFrame(Vector3.zAxis.mul(-subModeConfig.Offset.Z))),
				t,
			);

			this.lastOutput = output.camera.cf;
		}

		return output as T;
	}
}
