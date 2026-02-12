# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Project Overview

Cordbun is a high-performance Discord library for Bun. It provides a typed REST client with automatic rate limiting for Discord's API.

## Commands

### Build & Development
```bash
bun run build         # Compile TypeScript with tsdown
bun run dev           # Watch mode compilation
bun run type-check    # TypeScript type checking only (no emit)
bun run clean         # Remove dist folder
```

### Linting
```bash
bun run lint          # Run Biome linting checks (read-only)
bun run check         # Biome lint with auto-fix (--write --unsafe)
```

### Testing
```bash
bun test                          # Run all tests
bun test --filter unit            # Unit tests only
bun test --filter e2e             # E2E tests only
bun test --coverage               # Run with coverage report
bun test path/to/file.test.ts     # Run a single test file
bun test --filter "test name"     # Run tests matching pattern
```

## Architecture

```
src/
  constants/     # Discord API constants (URLs, intents, permissions, error codes)
  resources/     # Pure TypeScript interfaces/enums matching Discord API (no runtime code)
  rest/          # REST client with rate limiting (client.ts, bucket.ts, types.ts, events.ts)
  utils/         # Utilities: CDN URLs, file uploads, bitfields, snowflakes
```

### Key Modules
- **REST Client** (`src/rest/client.ts`): EventEmitter-based client with grouped API methods (`rest.guilds`, `rest.users`, etc.)
- **Rate Limiting** (`src/rest/bucket.ts`): Mutex-based concurrency control with bucket management
- **Resource Types** (`src/resources/`): Pure interface/enum definitions matching Discord API responses

## Code Style

### Formatting (Biome)
- **Indentation**: Tabs (width 4)
- **Line width**: 120 characters
- **Line endings**: LF
- **Quotes**: Double quotes
- **Semicolons**: Always
- **Trailing commas**: Always
- **Arrow parens**: Always (`(x) => x`)
- **Bracket spacing**: Yes (`{ foo }`)

### Naming Conventions
| Element | Convention | Example |
|---------|------------|---------|
| Types, Interfaces, Classes, Enums | PascalCase | `UserFlags`, `RESTClient` |
| Enum members | PascalCase or CONSTANT_CASE | `BugHunterLevel1`, `V10` |
| Type/Interface properties | snake_case (matching Discord API) | `guild_id`, `premium_type` |
| Private class members | camelCase | `bucketKeys`, `sweepTimer` |
| Functions, variables | camelCase | `getRouteKey`, `invalidRequestCount` |
| Constants | camelCase or CONSTANT_CASE | `API_BASE_URL`, `LIB_VERSION` |

### Import/Export Rules
- **ALWAYS** use `type` imports for types: `import type { User } from "./users.js"`
- **ALWAYS** use `type` exports for types: `export type { User }`
- **ALWAYS** include `.js` extension in relative imports (ESM requirement)
- **Group imports**: Node builtins first, then external, then internal
- Biome auto-organizes imports

```typescript
// Correct
import { EventEmitter } from "node:events";
import type { ApiVersion } from "../constants/index.js";
import { BucketManager } from "./bucket.js";
import type { RESTEvents } from "./events.js";

// Incorrect - missing type keyword or .js extension
import { User } from "./users";
```

### TypeScript Strictness
Strict mode is enabled with additional strictness:
- `noUncheckedIndexedAccess`: Array/object access returns `T | undefined`
- `exactOptionalPropertyTypes`: Optional props can't be set to `undefined` explicitly
- `noImplicitReturns`: All code paths must return
- `noPropertyAccessFromIndexSignature`: Use bracket notation for index signatures
- `verbatimModuleSyntax`: Enforces `import type` / `export type`

### Array Syntax
Use shorthand array syntax:
```typescript
// Correct
const users: User[] = [];
type Flags = UserFlags[];

// Incorrect
const users: Array<User> = [];
```

### Error Handling
Custom error classes extend `Error` with contextual properties:
```typescript
export class RESTError extends Error {
    constructor(
        public readonly status: number,
        public readonly code: JsonErrorCode,
        message: string,
        public readonly errors?: ApiErrorResponse["errors"],
    ) {
        super(message);
        this.name = "RESTError";
    }
}
```

Error types in this codebase:
- `RESTError`: Discord API error responses
- `RateLimitError`: Rate limit exceeded
- `CloudflareError`: Cloudflare blocks
- `TimeoutError`: Request timeout
- `FileTooLargeError`: File upload size exceeded

### JSDoc Comments
Document all public APIs with JSDoc including `@see` links to Discord docs:
```typescript
/**
 * Returns a user object for a given user ID.
 * @param userId - The ID of the user to fetch
 * @see {@link https://discord.com/developers/docs/resources/user#get-user}
 */
async getUser(userId: string): Promise<User> {
    return this.rest.get(`/users/${userId}`);
}
```

### Resource Types (interfaces matching Discord API)
- Properties use snake_case to match Discord API exactly
- Use `?` for optional fields, `| null` for nullable fields
- Reference Discord docs in JSDoc comments

```typescript
export interface User {
    /** The user's ID (snowflake) */
    id: string;
    /** The user's username, not unique across the platform */
    username: string;
    /** The user's avatar hash */
    avatar: string | null;
    /** Whether the user belongs to an OAuth2 application */
    bot?: boolean;
}
```

### Class Patterns
- Use `readonly` for properties that shouldn't change after construction
- Use `private readonly` for internal Maps/Sets
- Implement `destroy()` method for cleanup (timers, Maps, etc.)

### Functional Utilities
Prefer object-based utility namespaces over classes for stateless utilities:
```typescript
export const Bitfield = {
    has: <T>(bitfield: T, flag: T): boolean => (bitfield & flag) === flag,
    add: <T>(bitfield: T, flags: T): T => (bitfield | flags) as T,
} as const;
```

## Linting Rules (Biome)

### Errors
- `noUnusedImports`, `noUnusedVariables`, `noUnusedPrivateClassMembers`
- `useExportType`, `useImportType` (enforce type imports)
- `useConsistentArrayType` (shorthand `T[]`)
- `noAccumulatingSpread` (performance)

### Warnings
- `noExplicitAny` (avoid `any`, use `unknown` instead)
- `noExcessiveCognitiveComplexity` (max 25)

### Disabled
- `noNonNullAssertion` (non-null assertions `!` are allowed)
- `useBlockStatements` (single-line arrow functions OK)
- `noParameterAssign` (parameter reassignment OK)
