export class Weapon {
	private damage: number;
	private tool: Tool;

	constructor(tool: Tool, damage: number) {
		this.damage = damage;
		this.tool = tool;
	}
}
