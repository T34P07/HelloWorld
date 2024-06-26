import { CameraServiceType } from "client/types/service_types/CameraServiceType";
import CharacterService from "./CharacterService";
import { RenderPipeline } from "client/render_pipeline/RenderPipeline";
import { CameraCFrame } from "client/render_pipeline/nodes/camera_nodes/CameraCFrame";
import { CameraSway } from "client/render_pipeline/nodes/camera_nodes/CameraSway";
import CameraConfig from "client/config/CameraConfig";
import InputService from "client/services/InputService";
import { CameraNodeInputType } from "client/types/node_types/CameraNodeInputType";

import { Workspace, RunService, UserInputService, Players } from "@rbxts/services";
import Prefabs from "shared/libraries/Prefabs";
import { ViewmodelCFrame } from "client/render_pipeline/nodes/camera_nodes/viewmodel_nodes/ViewmodelCFrame";
import { ViewmodelSway } from "./../render_pipeline/nodes/camera_nodes/viewmodel_nodes/ViewmodelSway";
import { ViewmodelBobble } from "client/render_pipeline/nodes/camera_nodes/viewmodel_nodes/ViewmodelBobble";

const localPlayer = Players.LocalPlayer;
const camera = Workspace.CurrentCamera;

const CameraService: CameraServiceType = {
	modifiers: {
		principalAxes: {},
	},
	renderPipeline: new RenderPipeline([CameraCFrame, CameraSway, ViewmodelCFrame, ViewmodelSway, ViewmodelBobble]),
	camera: Workspace.CurrentCamera,
	viewmodel: Prefabs.Camera.Viewmodel.Clone(),
	Update: (dt) => {
		if (!CameraService.camera || !CharacterService.head || !CharacterService.hrp) return;

		localPlayer.CameraMode = Enum.CameraMode.LockFirstPerson;
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;

		const headCF = CharacterService.head.CFrame;
		const hrpCF = CharacterService.hrp.CFrame;

		CameraService.renderPipeline.PreUpdate(dt);

		const input: CameraNodeInputType = {
			camera: { instance: CameraService.camera, cf: headCF },
			viewmodel: { instance: CameraService.viewmodel, cf: CameraService.viewmodel.PrimaryPart!.CFrame },
		};

		const output = CameraService.renderPipeline.Update(dt, input);
		CameraService.camera!.CFrame = output.camera.cf;
		CameraService.viewmodel.PrimaryPart!.CFrame = output.viewmodel.cf;

		CameraService.renderPipeline.PostUpdate(dt);
		UserInputService.MouseIconEnabled = false;
	},
	Start: () => {
		RunService.BindToRenderStep("CameraUpdate", Enum.RenderPriority.Camera.Value, CameraService.Update);
		camera!.FieldOfView = CameraConfig.FOV;
		camera!.SetAttribute("Mode", 0);
		camera!.SetAttribute("SubMode", 0);
		CameraService.viewmodel.Parent = CameraService.camera;

		InputService.BindAction("CameraModeCycle").Connect(
			(actionName: string, userInputState: Enum.UserInputState, inputObject: InputObject) => {
				if (userInputState !== Enum.UserInputState.Begin) return;

				const mode = camera!.GetAttribute("Mode") as number;
				camera!.SetAttribute("Mode", mode < CameraConfig.Modes.size() - 1 ? mode + 1 : 0);
				camera!.SetAttribute("SubMode", 0);
			},
		);

		InputService.BindAction("CameraSubModeCycle").Connect(
			(actionName: string, userInputState: Enum.UserInputState, inputObject: InputObject) => {
				if (userInputState !== Enum.UserInputState.Begin) return;

				const mode = camera!.GetAttribute("Mode") as number;
				const cameraModeConfig = CameraConfig.Modes[mode];

				const submode = camera!.GetAttribute("SubMode") as number;
				camera!.SetAttribute("SubMode", submode < cameraModeConfig.SubModes.size() - 1 ? submode + 1 : 0);
			},
		);
	},
};

export default CameraService;
