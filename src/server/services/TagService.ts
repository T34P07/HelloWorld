import { Janitor } from "@rbxts/janitor";
import { CollectionService, StarterPlayer } from "@rbxts/services";
import Prefabs from "shared/libraries/Prefabs";
import {
	TagServiceType,
	TagClassModuleExportsType,
	TagConstructorType,
} from "server/types/service_typse/TagServiceTypes";
import { Tag } from "server/classes/tags/Tag";

const ServerTagService: TagServiceType = {
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

		const TagClass = ServerTagService.GetTagClass(tag);
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
		if (ServerTagService.TagHandlers[tag]) return;

		const janitor = new Janitor();
		const tagHandler = {
			janitor: janitor,
			instances: new Map<Instance, Tag | undefined>(),
		};

		ServerTagService.TagHandlers[tag] = tagHandler;

		janitor.Add(
			CollectionService.GetInstanceRemovedSignal(tag).Connect((instance) => {
				ServerTagService.OnInstanceRemoved(tag, instance, tagHandler);
			}),
		);

		janitor.Add(
			CollectionService.GetInstanceAddedSignal(tag).Connect((instance) => {
				ServerTagService.OnInstanceAdded(tag, instance, tagHandler);
			}),
		);

		CollectionService.GetTagged(tag).forEach((instance) => {
			ServerTagService.OnInstanceAdded(tag, instance, tagHandler);
		});
	},
	OnTagRemoved: (tag: string) => {
		const tagHandler = ServerTagService.TagHandlers[tag];
		if (!tagHandler) return;

		tagHandler.janitor.Destroy();
		ServerTagService.TagHandlers[tag] = undefined;
	},
	Start: () => {
		print("Starttt");
		CollectionService.TagRemoved.Connect(ServerTagService.OnTagRemoved);
		CollectionService.TagAdded.Connect(ServerTagService.OnTagAdded);

		CollectionService.GetAllTags().forEach((tag: string) => {
			ServerTagService.OnTagAdded(tag);
		});
	},
};

export default ServerTagService;
