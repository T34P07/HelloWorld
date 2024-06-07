import { Janitor } from "@rbxts/janitor";
import { CollectionService, ReplicatedStorage } from "@rbxts/services";

type ClientTagServiceType = {
	OnInstanceAdded: (tag: string, instance: Instance) => void;
	OnInstanceRemoved: (tag: string, instance: Instance) => void;
	OnTagAdded: (tag: string) => void;
	OnTagRemoved: (tag: string) => void;
	Start: () => void;
};

const ClientTagService: ClientTagServiceType = {
	//	TagMaids: {},
	OnInstanceAdded: (tag, instance) => {
		
	},
	OnInstanceRemoved: (tag, instance) => {},
	OnTagAdded: (tag) => {
		const janitor = new Janitor();

		janitor.Add(
			CollectionService.GetInstanceRemovedSignal(tag).Connect((instance) => {
				ClientTagService.OnInstanceRemoved(tag, instance);
			}),
		);

		janitor.Add(
			CollectionService.GetInstanceAddedSignal(tag).Connect((instance) => {
				ClientTagService.OnInstanceAdded(tag, instance);
			}),
		);
	},
	OnTagRemoved: (tag) => {},
	Start: () => {
		CollectionService.TagRemoved.Connect(ClientTagService.OnTagRemoved);
		CollectionService.TagAdded.Connect(ClientTagService.OnTagAdded);
	},
};

export default ClientTagService;
