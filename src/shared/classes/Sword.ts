import { Melee } from "./Melee";

export class Sword extends Melee {
	constructor(tool: Tool, damage: number) {
		super(tool, damage);
	}

	public attack() {}
}
