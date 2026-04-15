# Comparison Criteria

Use these criteria to compare Version 0, Version 1, and Version 2.

## Portability

Questions:

- How many files import provider-specific packages?
- How many app features know provider-specific concepts such as Sendbird channel URLs?
- Could another chat provider be added without editing order components?
- Is provider configuration isolated?
- Is provider UI isolated or still embedded in app components?

Possible measures:

- Count direct provider imports with `rg "@sendbird" <version>/src`.
- Count references to provider-specific names such as `Sendbird`, `SENDBIRD`, `GroupChannel`, `channelUrl`, and `useSendbird`.
- Record the folders that must change to replace Sendbird.

## Refactoring Cost

Questions:

- How many files changed from the baseline?
- How many lines changed?
- How much app behavior had to be touched to isolate chat?
- Were changes localized to `features/chat`, or spread across app features?

Possible measures:

- `git diff --stat original-frontend version-1` is not directly meaningful because they are separate copies, but file-by-file comparison can still estimate changed surfaces.
- Compare equivalent paths between versions.
- Record modified files by feature area:
  - App shell.
  - Header.
  - Orders.
  - Chat domain/facade/service/adapter.
  - Config.

## Code Complexity and Maintainability

Questions:

- Are provider-neutral responsibilities separated from provider-specific responsibilities?
- Are hooks small and focused?
- Are event subscriptions centralized?
- Are provider-specific types prevented from leaking into UI components?
- Is the architecture understandable for future maintainers?

Possible measures:

- Count files and modules in chat architecture.
- Count public exports from `features/chat`.
- Inspect TypeScript types crossing the chat/order boundary.
- Check whether provider code can be mocked in tests.
- Check for direct SDK calls outside the adapter.

## Performance

Questions:

- Does decoupling add unnecessary renders?
- Are subscriptions duplicated per component?
- Are unread count queries repeated too often?
- Does provider initialization happen once?
- Does the chat modal load heavy provider UI only when needed?

Possible measures:

- Use React DevTools Profiler for main interactions.
- Compare initial bundle output from `npm run build`.
- Record manual timings for app load, opening chat list, and opening a single conversation.
- Inspect whether unread subscriptions are cleaned up.
- Compare network/API behavior before and after decoupling.

## Suggested Comparison Table

Use a table like this in the final MBA analysis:

| Criterion | Version 0 | Version 1 | Version 2 |
| --- | --- | --- | --- |
| Portability | Highly coupled to Sendbird imports and UIKit components | TBD | TBD |
| Refactoring cost | Baseline | TBD | TBD |
| Complexity/maintainability | Simple structure, high provider leakage | TBD | TBD |
| Performance | Baseline behavior | TBD | TBD |

## Baseline Notes for Version 0

Version 0 has low architectural ceremony, but high provider leakage:

- Sendbird provider is in `App.tsx`.
- Sendbird SDK calls exist in `Header`, `ListItem`, and chat hooks.
- Sendbird UIKit components are rendered directly in `ChatModal`.
- The app passes `channelUrl` through order/chat UI state.
- User constants include provider-specific naming.

This is useful as a baseline because it demonstrates the typical fast implementation path and the later cost of provider replacement.
