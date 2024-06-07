import { Janitor } from "@rbxts/janitor";
import { CollectionService, ReplicatedStorage, StarterPlayer } from "@rbxts/services";
import { Tag } from "client/tags/Tag";

type ClientTagServiceType = {
	TagHandlers: {
		[tag: string]:
			| {
					janitor: Janitor;
					instances: {};
			  }
			| undefined;
	};
	GetTagClass: (tag: string) => Tag | void;
	OnInstanceAdded: (tag: string, instance: Instance) => void;
	OnInstanceRemoved: (tag: string, instance: Instance) => void;
	OnTagAdded: (tag: string) => void;
	OnTagRemoved: (tag: string) => void;
	Start: () => void;
};

const ClientTagService: ClientTagServiceType = {
	TagHandlers: {},
	GetTagClass: (tag) => {
		const classModule = StarterPlayer.WaitForChild("StarterPlayerScripts")
			.WaitForChild("TS")
			.WaitForChild("tags")
			.FindFirstChild(tag + "Tag") as ModuleScript | undefined;
		if (!classModule) return;

		const tagClass = require(classModule) as Tag;
		return tagClass;
	},
	OnInstanceAdded: (tag, instance) => {
		let tagClass = ClientTagService.GetTagClass(tag) as Tag;
		if (!tagClass) return;

		tagClass = new tagClass();
	},
	OnInstanceRemoved: (tag, instance) => {},
	OnTagAdded: (tag) => {
		const janitor = new Janitor();
		ClientTagService.TagHandlers[tag] = {
			janitor: janitor,
			instances: {},
		};

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

		CollectionService.GetTagged(tag).forEach((instance) => {
			ClientTagService.OnInstanceAdded(tag, instance);
		});
	},
	OnTagRemoved: (tag) => {
		const tagHandler = ClientTagService.TagHandlers[tag];
		if (!tagHandler) return;

		tagHandler.janitor.Destroy();
		ClientTagService.TagHandlers[tag] = undefined;
	},
	Start: () => {
		CollectionService.TagRemoved.Connect(ClientTagService.OnTagRemoved);
		CollectionService.TagAdded.Connect(ClientTagService.OnTagAdded);

		CollectionService.GetAllTags().forEach((tag: string) => {
			ClientTagService.OnTagAdded(tag);
		});
	},
};

export default ClientTagService;
