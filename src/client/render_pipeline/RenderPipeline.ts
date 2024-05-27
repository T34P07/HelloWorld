import { Node } from "./Node";

export interface PreUpdate {
	PreUpdate(dt: number, ...args: unknown[]): void;
}

export interface Update {
	Update<T>(dt: number, currentCFrame: T, ...args: unknown[]): T;
}

export interface Start {
	Start(...args: unknown[]): void;
}

export interface PostUpdate {
	PostUpdate(dt: number, ...args: unknown[]): void;
}

export class RenderPipeline implements PreUpdate, Update, Start, PostUpdate {
	private nodes: Node[] = [];
	constructor(nodes: (typeof Node)[]) {
		nodes.forEach((node: typeof Node) => {
			this.nodes.push(new node());
		});
	}

	Start(...args: unknown[]): void {
		this.nodes.forEach((node: Node) => {
			node.Start(...args);
		});
	}

	PreUpdate(dt: number, ...args: unknown[]): void {
		this.nodes.forEach((node: Node) => {
			node.PreUpdate(dt, ...args);
		});
	}

	Update<T>(dt: number, input: T, ...args: unknown[]): T {
		let output: T = input;

		this.nodes.forEach((node: Node) => {
			output = node.Update(dt, output, ...args);
		});

		return output;
	}

	PostUpdate(dt: number, ...args: unknown[]): void {
		this.nodes.forEach((node: Node) => {
			node.PostUpdate(dt, ...args);
		});
	}
}
