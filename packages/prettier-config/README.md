# SlideConvert Prettier Config

This is SlideConvert's monorepo "package".
It's a shared monorepo package, so it's intended to be used inside this monorepo.

## Usage

1. In any javascript package in the monorepo, add the following to `package.json`

```json
{
  "dependencies": {
    "@myproject/prettier-config": "workspace:*"
  },
  "prettier": "@myproject/prettier-config"
}
```

2. Then run `bun install`
