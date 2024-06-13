import { CollectionService, StarterPlayer } from "@rbxts/services";
import { Tag } from "client/classes/tags/Tag";

import Prefabs from "../../shared/libraries/Prefabs";
import {
	TagServiceType,
	TagClassModuleExportsType,
	TagConstructorType,
	TagClassesType,
} from "client/types/service_types/TagServiceType";
import { ToolTag } from "client/classes/tags/ToolTag";
import { WeaponTag } from "client/classes/tags/WeaponTag";
import { MeleeTag } from "client/classes/tags/MeleeTag";
import { KatanaTag } from "client/classes/tags/KatanaTag";
import { Trove } from "@rbxts/trove";

const TagService: TagServiceType = {
	tagClasses: {
		ToolTag: ToolTag,
		WeaponTag: WeaponTag,
		MeleeTag: MeleeTag,
		KatanaTag: KatanaTag,
	},
	tagHandlers: {},
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
