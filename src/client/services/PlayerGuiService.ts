import { StarterGui } from "@rbxts/services";

const PlayerGuiService = {
	Start: () => {
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.All, false);
	},
};

export default PlayerGuiService;
