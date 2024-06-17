import { UserInputService } from "@rbxts/services";
import { Node } from "client/render_pipeline/Node";
import ControlService from "client/services/ControlService";
import { CameraNodeInputType } from "client/types/node_types/CameraNodeInputType";
import { VectorSpring } from "shared/packages/Spring/Spring";

const UserGameSettings = UserSettings().GetService("UserGameSettings");

export class ViewmodelSway extends Node {
	private vectorSping = new VectorSpring(0.2, 10, 100);
	private lastMoveDirection = new Vector3();
	private rotation = new CFrame();

	PreUpdate(dt: number): void {
		const mouseDelta = UserInputService.GetMouseDelta();
		const mouseSensitivity = UserGameSettings.MouseSensitivity;

		this.vectorSping.impulse(Vector3.xAxis.mul(mouseDelta.X * 0.05).add(Vector3.yAxis.mul(mouseDelta.Y * 0.05)));

		this.lastMoveDirection = this.lastMoveDirection.Lerp(ControlService.moveDirection, 10 * dt);

		this.rotation = CFrame.Angles(
			-math.rad(this.lastMoveDirection.Z * 5),
			0,
			-math.rad(this.lastMoveDirection.X * 5),
		);
	}

	Update<T>(dt: number, input: T): T {
		const output = input as CameraNodeInputType;
		const [mode, submode] = [
			output.camera.instance.GetAttribute("Mode") as number,
			output.camera.instance.GetAttribute("SubMode") as number,
		];

		const offset = this.vectorSping.getOffset();
		output.viewmodel.cf = output.viewmodel.cf
			.add(output.viewmodel.cf.RightVector.mul(offset.X))
			.add(output.viewmodel.cf.UpVector.mul(offset.Y))
			.mul(this.rotation);

		return output as T;
	}
}
