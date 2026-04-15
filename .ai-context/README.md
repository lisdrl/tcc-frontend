# AI Context

This directory gives AI tools the minimum project context needed to work on this repository without rediscovering the thesis goal, repository structure, and chat-provider boundaries from scratch.

## Start Here

Read these files in order:

1. `project-overview.md` - thesis goal, application domain, and comparison versions.
2. `repository-map.md` - current directory layout, commands, and runtime notes.
3. `sendbird-coupling-map.md` - where the original code is coupled to Sendbird today.
4. `version-1-decoupling-approach.md` - facade approach implemented in Version 1.
5. `comparison-criteria.md` - how versions should be compared in the MBA project.

## Current State

- `original-frontend` is Version 0: the baseline implementation with Sendbird highly coupled to React components and app setup.
- `version-1` is the first decoupling experiment. It uses a facade approach that centralizes direct Sendbird usage inside `features/chat`.
- Version 2 is planned but does not exist in this repository yet.

## Important Constraint

Do not change `original-frontend` unless the task explicitly asks for a baseline fix. It should remain a stable comparison point for the highly coupled implementation.
