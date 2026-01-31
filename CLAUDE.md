# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cordbun is a high-performance Discord library built for Bun. It provides a typed REST client for interacting with Discord's API with automatic rate limit handling.

## Common Commands

```bash
bun run build       # Compile TypeScript with tsdown
bun run dev         # Watch mode compilation
bun run type-check  # TypeScript type checking only
bun run lint        # Run Biome linting checks
bun run check       # Biome lint with auto-fix
bun test            # Run all tests
bun test --filter unit    # Unit tests only
bun test --filter e2e     # E2E tests only
```

## Architecture

### Directory Structure

- `src/constants/` - Discord API constants (API URLs, intents, permissions, error codes)
- `src/resources/` - Pure TypeScript type definitions matching Discord API objects (no runtime code)
- `src/rest/` - REST client implementation with rate limiting
- `src/utils/` - Utilities for CDN URLs, file uploads, bitfields, snowflakes

### REST Client (`src/rest/`)

The core module - an EventEmitter-based REST client with:
- **client.ts** - Main REST class with all Discord API methods organized by resource type
- **bucket.ts** - Rate limit bucket management with mutex-based concurrency control
- **events.ts** - Event definitions (request, response, rateLimited, invalidRequestWarning)
- **types.ts** - Request/response types and custom errors (RESTError, RateLimitError, etc.)

API methods are grouped: `rest.guilds`, `rest.users`, `rest.channels`, etc.

### Resource Types (`src/resources/`)

Pure interface/enum definitions matching Discord API responses. Properties use snake_case to match the API. No implementation code - these are purely for type safety.

## Code Standards

### Naming Conventions
- Types, interfaces, classes, enums: PascalCase
- Enum members: PascalCase or CONSTANT_CASE
- Type properties: snake_case allowed (matching Discord API)
- Private class members: camelCase

### Formatting (Biome)
- Tab indentation (width 4)
- Line width: 120 characters
- Double quotes, always semicolons, trailing commas
- Array syntax: shorthand (`T[]` not `Array<T>`)

### TypeScript
- Strict mode with additional strictness options enabled
- Use `type` imports/exports (`import type`, `export type`)
- No unused imports, variables, or private class members
