import { CollectionService, ServerScriptService } from "@rbxts/services";
import Prefabs from "shared/libraries/Prefabs";
import {
	TagServiceType,
	TagClassModuleExportsType,
	TagConstructorType,
} from "server/types/service_types/TagServiceTypes";
import { Tag } from "server/classes/tags/Tag";
import { Trove } from "@rbxts/trove";

const tagClassModulesFolder = ServerScriptService.WaitForChild("TS").WaitForChild("classes").WaitForChild("tags");

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

		const trove = new Trove();
		const tagHandler = {
			trove: trove,
			instances: new Map<Instance, Tag | undefined>(),
		};

		TagService.TagHandlers[tag] = tagHandler;

		trove.add(
			CollectionService.GetInstanceRemovedSignal(tag).Connect((instance) => {
				TagService.OnInstanceRemoved(tag, instance, tagHandler);
			}),
		);

		trove.add(
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

		tagHandler.trove.destroy();
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
