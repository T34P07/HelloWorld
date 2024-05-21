import { Node } from "./Node";

export interface PreUpdate {
	PreUpdate(dt: number, ...args: unknown[]): void;
}

export interface Update {
	Update(dt: number, currentCFrame: CFrame, ...args: unknown[]): CFrame;
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

	Update(dt: number, currentCFrame: CFrame, ...args: unknown[]): CFrame {
		let finalCFrame: CFrame = currentCFrame;

		this.nodes.forEach((node: Node) => {
			finalCFrame = node.Update(dt, finalCFrame, ...args);
		});

		return finalCFrame;
	}

	PostUpdate(dt: number, ...args: unknown[]): void {
		this.nodes.forEach((node: Node) => {
			node.PostUpdate(dt, ...args);
		});
	}
}
