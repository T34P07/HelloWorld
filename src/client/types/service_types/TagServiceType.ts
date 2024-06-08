import { Janitor } from "@rbxts/janitor";
import { Tag } from "client/classes/tags/Tag";

export type TagConstructorType = new (instance: Instance) => Tag;

export type TagClassModuleExportsType = { [key: string]: unknown };

export type TagHandlerType = {
	janitor: Janitor;
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
