import { Trove } from "@rbxts/trove";
import { DashTag } from "client/classes/tags/DashTag";
import { KatanaTag } from "client/classes/tags/KatanaTag";
import { MeleeTag } from "client/classes/tags/MeleeTag";
import { Tag } from "client/classes/tags/Tag";
import { ToolTag } from "client/classes/tags/ToolTag";
import { WeaponTag } from "client/classes/tags/WeaponTag";

export type TagConstructorType = new (instance: Instance, tag: string) => Tag;

export type TagClassModuleExportsType = { [key: string]: unknown };

export type TagHandlerType = {
	trove: Trove;
	instances: Map<Instance, Tag | undefined>;
};

export type TagClassesType = {
	ToolTag: typeof ToolTag;
	WeaponTag: typeof WeaponTag;
	MeleeTag: typeof MeleeTag;
	KatanaTag: typeof KatanaTag;
	DashTag: typeof DashTag;
};

export type TagServiceType = {
	tagClasses: TagClassesType;
	tagHandlers: {
		[tag: string]: TagHandlerType | undefined;
	};
	GetTagInstance: (tag: string, instance: Instance) => unknown;
	OnInstanceAdded: (tag: string, instance: Instance, tagHandler: TagHandlerType) => void;
	OnInstanceRemoved: (tag: string, instance: Instance, tagHandler: TagHandlerType) => void;
	OnTagAdded: (tag: string) => void;
	OnTagRemoved: (tag: string) => void;
	Start: () => void;
};
