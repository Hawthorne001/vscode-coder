import * as semver from "semver";

export type FeatureSet = {
	vscodessh: boolean;
	proxyLogDirectory: boolean;
	wildcardSSH: boolean;
	buildReason: boolean;
};

/**
 * Builds and returns a FeatureSet object for a given coder version.
 */
export function featureSetForVersion(
	version: semver.SemVer | null,
): FeatureSet {
	return {
		vscodessh: !(
			version?.major === 0 &&
			version?.minor <= 14 &&
			version?.patch < 1 &&
			version?.prerelease.length === 0
		),

		// CLI versions before 2.3.3 don't support the --log-dir flag!
		// If this check didn't exist, VS Code connections would fail on
		// older versions because of an unknown CLI argument.
		proxyLogDirectory:
			(version?.compare("2.3.3") || 0) > 0 ||
			version?.prerelease[0] === "devel",
		wildcardSSH:
			(version ? version.compare("2.19.0") : -1) >= 0 ||
			version?.prerelease[0] === "devel",

		// The --reason flag was added to `coder start` in 2.25.0
		buildReason:
			(version?.compare("2.25.0") || 0) >= 0 ||
			version?.prerelease[0] === "devel",
	};
}
