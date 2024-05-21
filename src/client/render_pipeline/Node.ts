import { Start, PreUpdate, Update, PostUpdate } from "./RenderPipeline";

export class Node implements PreUpdate, Update, Start, PostUpdate {
	Start(...args: unknown[]): void {}
	PreUpdate(dt: number, ...args: unknown[]): void {}
	Update(dt: number, currentCFrame: CFrame, ...args: unknown[]): CFrame {
		return currentCFrame;
	}
	PostUpdate(dt: number, ...args: unknown[]): void {}
}
