import { CollectionService } from "@rbxts/services";

type ClientTagServiceType = {
	OnInstanceAdded: (tag: string, instance: Instance) => void;
	OnInstanceRemoved: (tag: string, instance: Instance) => void;
	OnTagAdded: (tag: string) => void;
	OnTagRemoved: (tag: string) => void;
	Start: () => void;
};

const ClientTagService: ClientTagServiceType = {
	OnInstanceAdded: (tag, instance) => {},
	OnInstanceRemoved: () => {},
	OnTagAdded: (tag) => {
		CollectionService.GetInstanceRemovedSignal(tag).Connect((instance) => {
			ClientTagService.OnInstanceRemoved(tag, instance);
		});

		CollectionService.GetInstanceAddedSignal(tag).Connect((instance) => {
			ClientTagService.OnInstanceAdded(tag, instance);
		});
	},
	OnTagRemoved: (tag) => {},
	Start: () => {
		CollectionService.TagRemoved.Connect(ClientTagService.OnTagRemoved);
		CollectionService.TagAdded.Connect(ClientTagService.OnTagAdded);
	},
};

export default ClientTagService;
