github-dependents-info --repo langfuse/langfuse-python --markdownfile ./components-mdx/dependents/python.md --sort stars --mergepackages --verbose --minstars 10
sed -i '' 's/# Dependents/### Dependents/' ./components-mdx/dependents/python.md
