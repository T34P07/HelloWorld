import { RenderPipeline } from "client/render_pipeline/RenderPipeline";

export type CameraServiceType = {
	modifiers: {
		principalAxes: {};
	};
	camera: Camera | undefined;
	renderPipeline: RenderPipeline;
	Update: (dt: number) => void;
	Start: () => void;
};
