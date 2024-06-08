import { Janitor } from "@rbxts/janitor";
import { CollectionService, StarterPlayer } from "@rbxts/services";
import { Tag } from "client/classes/tags/Tag";
import { ClientTagServiceType, TagClassModuleExportsType, TagConstructorType } from "client/types/ServiceType";
import Prefabs from "./Prefabs";

const ClientTagService: ClientTagServiceType = {
	TagHandlers: {},
	GetTagClass: (tag) => {
		const className = tag + "Tag";
		const classModule = StarterPlayer.WaitForChild("StarterPlayerScripts")
			.WaitForChild("TS")
			.WaitForChild("classes")
			.WaitForChild("tags")
			.FindFirstChild(className) as ModuleScript | undefined;
		if (!classModule) return;

		const moduleExports = require(classModule) as TagClassModuleExportsType;
		const tagClass = moduleExports[className] as TagConstructorType;
		return tagClass;
	},
	OnInstanceAdded: (tag, instance, tagHandler) => {
		if (instance.IsDescendantOf(Prefabs)) return;

		let tagInstance = tagHandler.instances.get(instance);
		if (tagInstance) return;

		const TagClass = ClientTagService.GetTagClass(tag);
		if (!TagClass) return;

		tagInstance = new TagClass(instance);
		tagHandler.instances.set(instance, tagInstance);
	},
	OnInstanceRemoved: (tag, instance, tagHandler) => {
		const tagInstance = tagHandler.instances.get(instance);
		if (!tagInstance) return;

		tagInstance.Destroy();
		tagHandler.instances.set(instance, undefined);
	},
	OnTagAdded: (tag) => {
		if (ClientTagService.TagHandlers[tag]) return;

		const janitor = new Janitor();
		const tagHandler = {
			janitor: janitor,
			instances: new Map<Instance, Tag | undefined>(),
		};

		ClientTagService.TagHandlers[tag] = tagHandler;

		janitor.Add(
			CollectionService.GetInstanceRemovedSignal(tag).Connect((instance) => {
				ClientTagService.OnInstanceRemoved(tag, instance, tagHandler);
			}),
		);

		janitor.Add(
			CollectionService.GetInstanceAddedSignal(tag).Connect((instance) => {
				ClientTagService.OnInstanceAdded(tag, instance, tagHandler);
			}),
		);

		CollectionService.GetTagged(tag).forEach((instance) => {
			ClientTagService.OnInstanceAdded(tag, instance, tagHandler);
		});
	},
	OnTagRemoved: (tag: string) => {
		const tagHandler = ClientTagService.TagHandlers[tag];
		if (!tagHandler) return;

		tagHandler.janitor.Destroy();
		ClientTagService.TagHandlers[tag] = undefined;
	},
	Start: () => {
		print("Starttt");
		CollectionService.TagRemoved.Connect(ClientTagService.OnTagRemoved);
		CollectionService.TagAdded.Connect(ClientTagService.OnTagAdded);

		CollectionService.GetAllTags().forEach((tag: string) => {
			ClientTagService.OnTagAdded(tag);
		});
	},
};

export default ClientTagService;
