const RemoveAllTags = (instance: Instance) => {
	instance.GetTags().forEach((tag: string) => {
		instance.RemoveTag(tag);
	});
};

export default RemoveAllTags;
