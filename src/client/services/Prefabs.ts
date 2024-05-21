const ReplicatedStorage = game.GetService(`ReplicatedStorage`);

interface Prefabs extends Folder {
	Animations: Folder & {
		Movement: Folder & {
			Abilities: Folder;
			Base: Folder;
		};
	};
}

const Prefabs = ReplicatedStorage.WaitForChild(`Prefabs`) as Prefabs;

export default Prefabs;
