import { Janitor } from "@rbxts/janitor";
import { CollectionService, StarterPlayer } from "@rbxts/services";
import { Tag } from "client/classes/tags/Tag";

import Prefabs from "../../shared/libraries/Prefabs";
import {
	TagServiceType,
	TagClassModuleExportsType,
	TagConstructorType,
} from "client/types/service_types/TagServiceType";

const tagClassModulesFolder = StarterPlayer.WaitForChild("StarterPlayerScripts")
	.WaitForChild("TS")
	.WaitForChild("classes")
	.WaitForChild("tags");

const TagService: TagServiceType = {
	TagHandlers: {},
	GetTagClass: (tag) => {
		const className = tag + "Tag";
		const classModule = tagClassModulesFolder.FindFirstChild(className) as ModuleScript | undefined;
		if (!classModule) return;

		const moduleExports = require(classModule) as TagClassModuleExportsType;
		const tagClass = moduleExports[className] as TagConstructorType;
		return tagClass;
	},
	OnInstanceAdded: (tag, instance, tagHandler) => {
		if (instance.IsDescendantOf(Prefabs)) return;

		let tagInstance = tagHandler.instances.get(instance);
		if (tagInstance) return;

		const TagClass = TagService.GetTagClass(tag);
		if (!TagClass) return;

		tagInstance = new TagClass(instance, tag);
		tagHandler.instances.set(instance, tagInstance);
	},
	OnInstanceRemoved: (tag, instance, tagHandler) => {
		const tagInstance = tagHandler.instances.get(instance);
		if (!tagInstance) return;

		tagInstance.Destroy();
		tagHandler.instances.set(instance, undefined);
	},
	OnTagAdded: (tag) => {
		if (TagService.TagHandlers[tag]) return;

		const janitor = new Janitor();
		const tagHandler = {
			janitor: janitor,
			instances: new Map<Instance, Tag | undefined>(),
		};

		TagService.TagHandlers[tag] = tagHandler;

		janitor.Add(
			CollectionService.GetInstanceRemovedSignal(tag).Connect((instance) => {
				TagService.OnInstanceRemoved(tag, instance, tagHandler);
			}),
		);

		janitor.Add(
			CollectionService.GetInstanceAddedSignal(tag).Connect((instance) => {
				TagService.OnInstanceAdded(tag, instance, tagHandler);
			}),
		);

		CollectionService.GetTagged(tag).forEach((instance) => {
			TagService.OnInstanceAdded(tag, instance, tagHandler);
		});
	},
	OnTagRemoved: (tag: string) => {
		const tagHandler = TagService.TagHandlers[tag];
		if (!tagHandler) return;

		tagHandler.janitor.Destroy();
		TagService.TagHandlers[tag] = undefined;
	},
	Start: () => {
		CollectionService.TagRemoved.Connect(TagService.OnTagRemoved);
		CollectionService.TagAdded.Connect(TagService.OnTagAdded);

		CollectionService.GetAllTags().forEach((tag: string) => {
			TagService.OnTagAdded(tag);
		});
	},
};

export default TagService;
