const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const { copyAll } = require('./copy_md_sources');

function writeFile(filePath, content) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
}

test('creates root-level aliases for marketing pages and keeps security paths scoped', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-md-sources-'));
    const sourceDir = path.join(tempRoot, 'content');
    const outputDir = path.join(tempRoot, 'public', 'md-src');

    writeFile(path.join(sourceDir, 'marketing', 'terms.mdx'), '# Terms');
    writeFile(path.join(sourceDir, 'security', 'toms.mdx'), '# TOMS');

    copyAll({ sourceDir, outputDir });

    assert.equal(fs.readFileSync(path.join(outputDir, 'marketing', 'terms.md'), 'utf8'), '# Terms');
    assert.equal(fs.readFileSync(path.join(outputDir, 'terms.md'), 'utf8'), '# Terms');
    assert.equal(fs.readFileSync(path.join(outputDir, 'security', 'toms.md'), 'utf8'), '# TOMS');
    assert.equal(fs.existsSync(path.join(outputDir, 'toms.md')), false);

    fs.rmSync(tempRoot, { recursive: true, force: true });
});
