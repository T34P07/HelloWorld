export class Tag {
	protected class: string;
	protected instance: Instance;

	constructor(instance: Instance, tagClass: string) {
		this.instance = instance;
		this.class = tagClass;
	}
	Destroy() { }
}
