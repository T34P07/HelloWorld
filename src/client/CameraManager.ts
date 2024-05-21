import CharacterManager from "./CharacterManager";
import { RenderPipeline } from "./render_pipeline/RenderPipeline";
import { CameraCFrame } from "./render_pipeline/nodes/CameraCFrame";

const Workspace = game.GetService("Workspace");
const RunService = game.GetService("RunService");
const UserInputService = game.GetService("UserInputService");
const Players = game.GetService("Players");

const localPlayer = Players.LocalPlayer;

type CameraManager = {
	mode: number;
	submode: number;
	offset: Vector3;
	modifiers: {
		principalAxes: {};
	};
	camera: Camera | undefined;
	renderPipeline: RenderPipeline;
	Update: (dt: number) => void;
	Start: () => void;
};

const CameraManager: CameraManager = {
	mode: 1,
	submode: 1,
	offset: Vector3.zero,
	modifiers: {
		principalAxes: {},
	},
	renderPipeline: new RenderPipeline([CameraCFrame]),
	camera: Workspace.CurrentCamera,
	Update: (dt) => {
		if (!CameraManager.camera || !CharacterManager.head || !CharacterManager.hrp) return;

		localPlayer.CameraMode = Enum.CameraMode.LockFirstPerson;
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;

		const headCF = CharacterManager.head.CFrame;
		const hrpCF = CharacterManager.hrp.CFrame;

		CameraManager.renderPipeline.PreUpdate(dt);

		const output = CameraManager.renderPipeline.Update(dt, headCF);
		CameraManager.camera!.CFrame = output;

		CameraManager.renderPipeline.PostUpdate(dt);
	},
	Start: () => {
		RunService.BindToRenderStep("CameraUpdate", Enum.RenderPriority.Camera.Value, CameraManager.Update);
	},
};

export default CameraManager;
