import { RenderPipeline } from "client/render_pipeline/RenderPipeline";
import Prefabs from "shared/libraries/Prefabs";

export type CameraServiceType = {
	modifiers: {
		principalAxes: {};
	};
	camera: Camera | undefined;
	viewmodel: Model;
	renderPipeline: RenderPipeline;
	Update: (dt: number) => void;
	Start: () => void;
};
