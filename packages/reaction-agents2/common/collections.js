ReactionCore.Schemas.AgentsPackageConfig = new SimpleSchema([
	ReactionCore.Schemas.PackageConfig, {
		"settings.name": {
			type: String,
			defaultValue: "Basic iAgent"
		}
	}
]);


