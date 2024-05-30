import CharacterService from "./CharacterService";
import { RenderPipeline } from "./render_pipeline/RenderPipeline";
import { CameraCFrame } from "./render_pipeline/nodes/CameraCFrame";
import { CameraServiceType } from "../shared/types/ServiceType";
import CameraConfig from "./config/CameraConfig";
import InputService from "./InputService";

const Workspace = game.GetService("Workspace");
const RunService = game.GetService("RunService");
const UserInputService = game.GetService("UserInputService");
const Players = game.GetService("Players");

const localPlayer = Players.LocalPlayer;
const camera = Workspace.CurrentCamera;

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
		camera!.FieldOfView = CameraConfig.FOV;

		InputService.BindAction("CameraModeCycle", (actionName, userInputState, inputObject) => {
			if (userInputState !== Enum.UserInputState.Begin) return;

			CameraService.mode = CameraService.mode < CameraConfig.Modes.length ? CameraService.mode + 1 : 1;
		});

		InputService.BindAction("CameraSubModeCycle", (actionName, userInputState, inputObject) => {
			if (userInputState !== Enum.UserInputState.Begin) return;

			CameraService.submode = 3 - CameraService.submode;
		});
	},
};

export default CameraService;
