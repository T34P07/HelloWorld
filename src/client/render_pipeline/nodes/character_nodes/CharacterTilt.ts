import { CharacterNodeInputType } from "client/types/node_types/CharacterNodeInputType";
import { Node } from "client/render_pipeline/Node";
import CharacterTiltConfig from "client/config/CharacterTiltConfig";

const vectorXZ = new Vector3(1, 0, 1);

export class CharacterTilt extends Node {
	private rot = new CFrame();

	Update<T>(dt: number, input: T): T {
		const output = input as CharacterNodeInputType;

		const velocity = output.hrp.instance.AssemblyLinearVelocity.mul(vectorXZ);
		const direction = velocity.Unit;

		const angle =
			velocity.Magnitude < 2 ? 0 : output.hrp.cf.LookVector.Dot(direction) * CharacterTiltConfig.Factor.X;
		const angle1 =
			velocity.Magnitude < 2 ? 0 : output.hrp.cf.RightVector.Dot(direction) * CharacterTiltConfig.Factor.Y;

		this.rot = this.rot.Lerp(CFrame.Angles(angle, -angle1, 0), CharacterTiltConfig.Responsiveness * dt);
		output.rootJoint.c0 = output.rootJoint.c0.mul(this.rot);
		return output as T;
	}
}
