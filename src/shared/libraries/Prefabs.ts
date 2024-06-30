const ReplicatedStorage = game.GetService(`ReplicatedStorage`);

interface Prefabs extends Folder {
	Animations: Folder & {
		Movement: Folder & {
			Action: Folder;
			Base: Folder;
		};
		Tools: Folder & {
			Weapons: Folder & {
				[name: string]: Folder & {
					Action: Folder;
					Base: Folder;
				};
			};
		};
	};
	Camera: Folder & {
		Viewmodel: Model & {
			["Body Colors"]: BodyColors;
			Humanoid: Humanoid;
			HumanoidRootPart: Part;
			["Left Arm"]: Part;
			["Right Arm"]: Part;
			Torso: Part;
		};
	};
	Tools: Folder;
}

const Prefabs = ReplicatedStorage.WaitForChild(`Prefabs`) as Prefabs;

export default Prefabs;
