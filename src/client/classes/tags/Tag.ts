export class Tag {
	protected class: string;
	protected instance: Instance;

	constructor(instance: Instance, toolclass: string) {
		this.instance = instance;
		this.class = toolclass;
	}
	Destroy() {}
}
