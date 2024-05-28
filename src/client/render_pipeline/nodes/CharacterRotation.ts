import { CharacterNodeInputType } from "shared/types/NodeTypes";
import { Node } from "../Node";

const Workspace = game.GetService("Workspace");
const camera = Workspace.CurrentCamera;

export class CharacterRotation extends Node {
	Update<T>(dt: number, input: T, mode: number): T {
		const output = input as CharacterNodeInputType;

		const [_, x] = camera!.CFrame.ToOrientation();

		output.hrp.cf = new CFrame(output.hrp.cf.Position).mul(CFrame.fromOrientation(0, x, 0));

		return output as T;
	}
}
