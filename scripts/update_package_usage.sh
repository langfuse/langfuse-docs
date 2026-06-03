uv run --with github-dependents-info github-dependents-info --repo langfuse/langfuse-python --markdownfile ./components-mdx/dependents/python.md --sort stars --mergepackages --verbose --minstars 10
sed -i '' 's/# Dependents/### Dependents/' ./components-mdx/dependents/python.md
sed -i '' 's/<img class="avatar mr-2" src="/![avatar](/g' ./components-mdx/dependents/python.md
sed -i '' 's/" width="20" height="20" alt="">/)/g' ./components-mdx/dependents/python.md

uv run --with github-dependents-info github-dependents-info --repo langfuse/langfuse-js --markdownfile ./components-mdx/dependents/js.md --sort stars --mergepackages --verbose --minstars 10
sed -i '' 's/# Dependents/### Dependents/' ./components-mdx/dependents/js.md
sed -i '' 's/<img class="avatar mr-2" src="/![avatar](/g' ./components-mdx/dependents/js.md
sed -i '' 's/" width="20" height="20" alt="">/)/g' ./components-mdx/dependents/js.md