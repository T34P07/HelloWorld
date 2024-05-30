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

		CameraService.renderPipeline.PreUpdate(dt);

		const output = CameraService.renderPipeline.Update(dt, headCF);
		CameraService.camera!.CFrame = output;

		CameraService.renderPipeline.PostUpdate(dt);
	},
	Start: () => {
		RunService.BindToRenderStep("CameraUpdate", Enum.RenderPriority.Camera.Value, CameraService.Update);
		camera!.FieldOfView = CameraConfig.FOV;
		camera!.SetAttribute("Mode", 0);
		camera!.SetAttribute("SubMode", 0);

		InputService.BindAction("CameraModeCycle", (actionName, userInputState, inputObject) => {
			if (userInputState !== Enum.UserInputState.Begin) return;

			const mode = camera!.GetAttribute("Mode") as number;
			camera!.SetAttribute("Mode", mode < CameraConfig.Modes.size() - 1 ? mode + 1 : 0);
		});

		InputService.BindAction("CameraSubModeCycle", (actionName, userInputState, inputObject) => {
			if (userInputState !== Enum.UserInputState.Begin) return;

			const submode = camera!.GetAttribute("SubMode") as number;
			camera!.SetAttribute("SubMode", submode < 1 ? submode + 1 : 0);
		});
	},
};

export default CameraService;
