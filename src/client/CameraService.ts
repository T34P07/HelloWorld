import CharacterService from "./CharacterService";
import { RenderPipeline } from "./render_pipeline/RenderPipeline";
import { CameraCFrame } from "./render_pipeline/nodes/CameraCFrame";
import { CameraServiceType } from "../shared/types/ServiceType";

const Workspace = game.GetService("Workspace");
const RunService = game.GetService("RunService");
const UserInputService = game.GetService("UserInputService");
const Players = game.GetService("Players");

const localPlayer = Players.LocalPlayer;

const CameraService: CameraServiceType = {
	mode: 2,
	submode: 1,
	offset: Vector3.zero,
	modifiers: {
		principalAxes: {},
	},
	renderPipeline: new RenderPipeline([CameraCFrame]),
	camera: Workspace.CurrentCamera,
	Update: (dt) => {
		if (!CameraService.camera || !CharacterService.head || !CharacterService.hrp) return;

		localPlayer.CameraMode = Enum.CameraMode.LockFirstPerson;
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;

		const headCF = CharacterService.head.CFrame;
		const hrpCF = CharacterService.hrp.CFrame;

		CameraService.renderPipeline.PreUpdate(dt, CameraService.mode, CameraService.submode);

		const output = CameraService.renderPipeline.Update(dt, headCF, CameraService.mode, CameraService.submode);
		CameraService.camera!.CFrame = output;

		CameraService.renderPipeline.PostUpdate(dt, CameraService.mode, CameraService.submode);
	},
	Start: () => {
		RunService.BindToRenderStep("CameraUpdate", Enum.RenderPriority.Camera.Value, CameraService.Update);
	},
};

export default CameraService;
