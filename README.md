# Purpose

Bundle NPM packages with `webpack`, `rollup`,... and provide them :-)

## Usage

Override dependency version in your `package.json` file like:

```json
{
  "dependencies": {
    "webpack": "thachnn/bundled#webpack-4.46.0",
    "webpack-cli": "^3.3.0"
  },
  "resolutions": {
    "webpack-cli": "thachnn/bundled#webpack-cli-3.3.12"
  },
  "overrides": {
    "webpack-cli": "thachnn/bundled#webpack-cli-3.3.12"
  }
}
```

Or install bundled packages directly:

```bash
npm install -g thachnn/bundled#terser-4.8.1
```

## Bundled packages

- `webpack` v4.46.0 -> [thachnn/bundled#webpack-4.46.0](../../releases/tag/webpack-4.46.0)
- `terser` v4.8.1 -> [thachnn/bundled#terser-4.8.1](../../releases/tag/terser-4.8.1)
- `webpack-cli` v3.3.12 -> [thachnn/bundled#webpack-cli-3.3.12](../../releases/tag/webpack-cli-3.3.12)
- `yarn` v1.22.19 -> [thachnn/bundled#yarn-1.22.19](../../releases/tag/yarn-1.22.19)
- ...

Take a look at [`Tags` list](../../tags) for more provided packages
