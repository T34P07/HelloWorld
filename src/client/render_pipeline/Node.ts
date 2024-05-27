import { Start, PreUpdate, Update, PostUpdate } from "./RenderPipeline";

export class Node implements PreUpdate, Update, Start, PostUpdate {
	Start(...args: unknown[]): void {}
	PreUpdate(dt: number, ...args: unknown[]): void {}
	Update<T>(dt: number, input: T, ...args: unknown[]): T {
		return input;
	}
	PostUpdate(dt: number, ...args: unknown[]): void {}
}
