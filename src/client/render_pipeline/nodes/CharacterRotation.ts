import { CharacterNodeInputType } from "shared/types/NodeTypes";
import { Node } from "../Node";
const Workspace = game.GetService("Workspace");
const UserInputService = game.GetService("UserInputService");
const UserGameSettings = UserSettings().GetService("UserGameSettings");

const Vector3xyAxis = new Vector3(1, 1);

const camera = Workspace.CurrentCamera;

export class CharacterRotation extends Node {
	private rot = 0;

	Update<T>(dt: number, input: T, mode: number): T {
		const output = input as CharacterNodeInputType;

		const [y, x, z] = camera!.CFrame.ToOrientation();

		output.hrp.cf = new CFrame(output.hrp.cf.Position).mul(CFrame.fromOrientation(0, x, 0));

		return output as T;
	}
}
