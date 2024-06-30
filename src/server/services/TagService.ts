import { TagServiceType, TagHandlerType, TagClassesType } from './../types/service_types/TagServiceTypes';
import { CollectionService } from "@rbxts/services";

import Prefabs from "../../shared/libraries/Prefabs";
import { ToolTag } from "server/classes/tags/ToolTag";
import { WeaponTag } from "server/classes/tags/WeaponTag";
import { MeleeTag } from "server/classes/tags/MeleeTag";
import { KatanaTag } from "server/classes/tags/KatanaTag";
import { Trove } from "@rbxts/trove";
import { Tag } from 'server/classes/tags/Tag';

const TagService: TagServiceType = {
	tagClasses: {
		ToolTag: ToolTag,
		WeaponTag: WeaponTag,
		MeleeTag: MeleeTag,
		KatanaTag: KatanaTag
	},
	tagHandlers: {},
	GetTagInstance: (tag, instance: Instance) => {
		const tagHandler = TagService.tagHandlers[tag] as TagHandlerType;
		const tagInstance = tagHandler.instances.get(instance);

		return tagInstance;
	},
	OnInstanceAdded: (tag, instance, tagHandler) => {
		if (instance.IsDescendantOf(Prefabs)) return;

		let tagInstance = tagHandler.instances.get(instance);
		if (tagInstance) return;

		const TagClass = TagService.tagClasses[`${tag}Tag` as keyof TagClassesType];
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
		if (TagService.tagHandlers[tag]) return;

		const trove = new Trove();
		const tagHandler = {
			trove: trove,
			instances: new Map<Instance, Tag | undefined>(),
		};

		TagService.tagHandlers[tag] = tagHandler;

		trove.connect(CollectionService.GetInstanceRemovedSignal(tag), (instance) => {
			TagService.OnInstanceRemoved(tag, instance, tagHandler);
		});

		trove.connect(CollectionService.GetInstanceAddedSignal(tag), (instance) => {
			TagService.OnInstanceAdded(tag, instance, tagHandler);
		});

		CollectionService.GetTagged(tag).forEach((instance) => {
			TagService.OnInstanceAdded(tag, instance, tagHandler);
		});
	},
	OnTagRemoved: (tag: string) => {
		const tagHandler = TagService.tagHandlers[tag];
		if (!tagHandler) return;

		tagHandler.trove.destroy();
		tagHandler.instances.forEach((instance) => {
			instance!.Destroy();
		});
		TagService.tagHandlers[tag] = undefined;
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
