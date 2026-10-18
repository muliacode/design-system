// Prints the CHANGELOG.md section for one version, for the release notes,
// and fails when there is none, so nothing is released undocumented.
//
//   node scripts/changelog-section.mjs 0.1.0
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// The section's text, or null when CHANGELOG.md has none for this version.
export function sectionFor(version) {
    const changelog = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
    const sections = changelog.split(/^## /m).slice(1);
    const section = sections.find((s) => s.startsWith(`${version} `) || s.startsWith(`${version}\n`) || s.startsWith(`[${version}]`));
    return section ? section.slice(section.indexOf('\n') + 1).trim() : null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const version = process.argv[2];
    if (!version) {
        console.error('Usage: changelog-section.mjs <version>');
        process.exit(2);
    }
    const section = sectionFor(version);
    if (section === null) {
        console.error(`CHANGELOG.md has no section for ${version}. Rename "Unreleased" to "${version} (YYYY-MM-DD)" before tagging.`);
        process.exit(1);
    }
    process.stdout.write(section + '\n');
}
