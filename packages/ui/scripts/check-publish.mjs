// Runs before every npm publish, by hand or from the release workflow, so a
// package without a released version or changelog section never reaches npm.
// The build runs after it (see prepublishOnly), so the tarball always has dist.
import { readFileSync } from 'node:fs';

import { sectionFor } from './changelog-section.mjs';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

if (version === '0.0.0') {
    console.error('package.json still says 0.0.0. Set the version you are releasing first; see Releasing in CONTRIBUTING.md.');
    process.exit(1);
}
if (sectionFor(version) === null) {
    console.error(`CHANGELOG.md has no section for ${version}. Rename "Unreleased" to "${version} (YYYY-MM-DD)" first.`);
    process.exit(1);
}
