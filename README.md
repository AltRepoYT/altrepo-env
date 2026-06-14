# @altrepo/env

@altrepo/env is a tiny zero-dependency TypeScript utility for parsing and validating environment variables at startup.

## Features

- **Zero Dependency:** No bulky external schema libraries.
- **TypeScript-first:** Validated objects have beautifully inferred types.
- **Node-focused:** Perfectly suited for standard Node.js backends.
- **Strict by Default:** Throws instantly on missing or invalid configurations so your app doesn't crash randomly in production.
- **Aggregated Errors:** Provides clear terminal output summarizing all invalid keys at once.

## API Shape

```typescript
import { createEnv, str, num, bool, url } from "@altrepo/env";

const env = createEnv({
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),

  PORT: num({
    default: 3000,
    min: 1,
    max: 65535,
  }),

  DATABASE_URL: url(),

  ENABLE_CACHE: bool({
    default: false,
  }),
});
```

You can also pass a custom source, making testing extremely easy:

```typescript
const env = createEnv(schema, {
  source: {
    PORT: "3000",
    ENABLE_CACHE: "true",
  },
});
```

## AltRepo

@altrepo/env is part of the [AltRepo developer tools](https://altrepo.net/dev/) developer utility ecosystem.

More tools and packages:
https://altrepo.net
