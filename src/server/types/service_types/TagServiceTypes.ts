import { Trove } from "@rbxts/trove";
import { Tag } from "server/classes/tags/Tag";

export type TagConstructorType = new (instance: Instance, tag: string) => Tag;

export type TagClassModuleExportsType = { [key: string]: unknown };

export type TagHandlerType = {
	trove: Trove;
	instances: Map<Instance, Tag | undefined>;
};
export type TagServiceType = {
	TagHandlers: {
		[tag: string]: TagHandlerType | undefined;
	};
	GetTagClass: (tag: string) => TagConstructorType | void;
	OnInstanceAdded: (tag: string, instance: Instance, tagHandler: TagHandlerType) => void;
	OnInstanceRemoved: (tag: string, instance: Instance, tagHandler: TagHandlerType) => void;
	OnTagAdded: (tag: string) => void;
	OnTagRemoved: (tag: string) => void;
	Start: () => void;
};
