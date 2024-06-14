import { Node } from "client/render_pipeline/Node";
import { CameraNodeInputType } from "client/types/node_types/CameraNodeInputType";

export class ViewmodelCFrame extends Node {
	PreUpdate(dt: number): void {}

	Update<T>(dt: number, input: T): T {
		const output = input as CameraNodeInputType;
		const [mode, submode] = [
			output.camera.instance.GetAttribute("Mode") as number,
			output.camera.instance.GetAttribute("SubMode") as number,
		];

		output.viewmodel.cf = output.camera.cf;

		return output as T;
	}
}
