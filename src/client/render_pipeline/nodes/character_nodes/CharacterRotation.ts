import { Node } from "../../Node";
import { CharacterNodeInputType } from "shared/types/NodeTypes";

const Workspace = game.GetService("Workspace");
const camera = Workspace.CurrentCamera;

export class CharacterRotation extends Node {
	Update<T>(dt: number, input: T): T {
		const output = input as CharacterNodeInputType;

		const lookVector = camera!.CFrame.LookVector;
		const yaw = math.atan2(-lookVector.X, -lookVector.Z);

		const rot = camera!.GetAttribute("OrbitalAxis") as Vector2;

		output.hrp.cf = new CFrame(output.hrp.cf.Position).mul(CFrame.fromOrientation(0, rot.X, 0));

		return output as T;
	}
}
