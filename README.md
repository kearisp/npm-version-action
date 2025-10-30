# kearisp/npm-version-action

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/kearisp/npm-version-action)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

### Usage

This action automatically modifies the package version in `package.json` file by adding a specified tag to the current
version and incrementing the version counter when reused. For example, it can be used to create beta versions or release
candidates.

```yaml
steps:
  - name: Setup beta version
    uses: kearisp/npm-version-action@v0.0.2
    with:
        tag: beta
```

#### Example of changes:

- **Before** changing `package.json` content:

```json
{
    "name": "package-name",
    "version": "1.0.0"
}
```

- **After** action process:

```json
{
    "name": "package-name",
    "version": "1.0.0-beta.0"
}
```

### Notes:

- Version counter (e.g., `beta.0`, `beta.1`) automatically increments based on already published versions in the npm
  registry.
- The action is useful for automating the creation of pre-release package versions before the main release.