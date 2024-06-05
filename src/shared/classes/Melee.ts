import { Weapon } from "./Weapon";

export class Melee extends Weapon {
	constructor(tool: Tool, damage: number) {
		super(tool, damage);
	}

	public attack() {}
}
