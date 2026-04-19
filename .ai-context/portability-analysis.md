# Portability Analysis

This document analyzes whether portability improves across `version-0`, `version-1`, and `version-2`, and, if it does, in which degree and dimensions.

Portability is treated as the ability to replace or add a chat provider without forcing unrelated application features to understand provider-specific APIs, identifiers, UI components, or configuration.

## Method

The analysis uses the portability questions from `comparison-criteria.md` and combines static measurements with architectural inspection.

Commands used for the static measurements:

```sh
rg --files-with-matches "@sendbird" version-0/src version-1/src version-2/src
rg --count-matches "@sendbird|Sendbird|SENDBIRD|GroupChannel|channelUrl|useSendbird|QueryType|UserEventHandler" version-0/src version-1/src version-2/src
```

The metrics are useful indicators, but they are not enough by themselves. A higher number of provider-specific references can still be more portable if those references are concentrated behind a stable provider boundary. For this reason, the analysis emphasizes where coupling lives, not only how many matches exist.

## Metrics Overview

| Metric | Version 0: `version-0` | Version 1: `version-1` | Version 2: `version-2` |
| --- | --- | --- | --- |
| Direct `@sendbird` import files | 5 files | 5 files | 3 files |
| Provider-specific reference files | 7 files | 5 files | 4 files |
| Total provider-specific reference matches | 71 matches | 58 matches | 95 matches |
| Main location of provider-specific code | App shell, shared header, order components, chat components/hooks, user constants | `features/chat` only | `features/chat/adapters/sendbird`, plus app-facing provider selection |
| App/order components contain provider concepts | Yes. Header and order components use Sendbird SDK concepts, `SENDBIRD_USER_ID`, and `channelUrl`. | No direct Sendbird concepts in app shell, header, or order components. | No direct Sendbird concepts in app shell, header, or order components. |
| Provider UI isolation | Low. `ChatModal` imports Sendbird UIKit directly. | Partial. Sendbird UIKit is localized to `features/chat`, but still embedded in app-owned `ChatModal`. | Stronger. App-owned `ChatModal` consumes provider-supplied `ChatViews`; Sendbird UIKit is inside the adapter. |
| Provider configuration isolation | Low. App id and access token are in `App.tsx`; user id is in `features/users/constants`. | Improved. Chat config is isolated in `features/chat/config/chatConfig.ts`. | Improved. Chat config is isolated, and Sendbird setup is composed through the provider adapter. |
| Dependency portability | Low. Depends on `@sendbird/uikit-react`. | Low. Still depends on `@sendbird/uikit-react`. | Low. Still depends on `@sendbird/uikit-react`. |
| Estimated replacement blast radius | High: app shell, shared header, order components, chat hooks/components, user constants, package dependency. | Medium: mostly `features/chat` internals and package dependency. | Lower: add a new adapter, update provider selection/config, and adjust package dependency. |

Version 2 has more total provider-specific text matches than Version 1. This does not mean Version 2 is less portable overall. Most Version 2 matches are concentrated in adapter-local types and implementation details, especially `createSendbirdChatClient.ts`, where provider-specific SDK calls are intentionally hidden behind the `ChatClient` contract.

## Comparison Criteria Answers

| Question from `comparison-criteria.md` | Version 0: `version-0` | Version 1: `version-1` | Version 2: `version-2` |
| --- | --- | --- | --- |
| How many files import provider-specific packages? | 5 source files import `@sendbird` packages. | 5 source files import `@sendbird` packages. | 3 source files import `@sendbird` packages. |
| How many app features know provider-specific concepts such as Sendbird channel URLs? | Several app areas know provider concepts: app shell, shared header, orders, chat UI/hooks, and user constants. | Non-chat app features do not know Sendbird concepts. Provider concepts are centralized in `features/chat`. | Non-chat app features do not know Sendbird concepts. Provider concepts are concentrated in `features/chat/adapters/sendbird`. |
| Could another chat provider be added without editing order components? | No. `ListItem` and `OrderDetails` directly depend on Sendbird concepts or channel identifiers. | Yes for order components. A provider replacement would still require rewriting chat hooks and chat UI internals. | Yes for order components. A new provider should implement `ChatClient`, `ChatViews`, and provider composition, then be selected by `ChatProvider`. |
| Is provider configuration isolated? | No. Provider setup and credentials are in `App.tsx`, and the Sendbird user id is in `features/users/constants`. | Mostly yes. Provider config is in `features/chat/config/chatConfig.ts` and used by `features/chat/providers/ChatProvider.tsx`. | Yes for the current design. Config is in `features/chat/config/chatConfig.ts`, while Sendbird setup is contained in the adapter provider path. |
| Is provider UI isolated or still embedded in app components? | Still embedded. `ChatModal` renders Sendbird UIKit components directly. | Partially isolated. Sendbird UIKit is inside `features/chat`, but `ChatModal` still renders it directly. | Better isolated. `ChatModal` renders provider-neutral `ConversationList` and `Conversation` views supplied by the active implementation. |
| Which folders must change to replace Sendbird? | `src/App.tsx`, `src/components/Header`, `src/features/orders`, `src/features/chat`, `src/features/users/constants`, and package metadata. | Mainly `src/features/chat` and package metadata. Header and order features should remain stable. | Mainly `src/features/chat/adapters`, `src/features/chat/providers`, `src/features/chat/config`, and package metadata. Public chat consumers should remain stable. |

## Version 0: Original Frontend

Version 0 is the baseline with low portability.

Provider-specific code is spread across product-facing application areas. `App.tsx` initializes `SendbirdProvider`, imports Sendbird UIKit CSS, and hardcodes provider credentials. `Header` reads the Sendbird SDK through `useSendbird()` and registers Sendbird event handlers. `ListItem` creates Sendbird group-channel queries, uses `QueryType`, checks member ids, and subscribes to Sendbird channel events. `OrderDetails` imports `SENDBIRD_USER_ID`, stores `channelUrl`, and passes that identifier into `ChatModal`.

The chat UI is also provider-bound. `ChatModal` imports Sendbird UIKit's channel list and channel view components directly, stores a Sendbird `GroupChannel` type in React state, and passes `channelUrl` values into UIKit components.

Portability impact:

| Dimension | Assessment |
| --- | --- |
| App-feature portability | Low. Header and order features know Sendbird SDK and channel concepts. |
| Chat-module portability | Low. Chat hooks and components are written directly against Sendbird. |
| Provider UI portability | Low. Sendbird UIKit is embedded in app-owned chat UI. |
| Configuration portability | Low. Provider config is in app setup and user constants. |
| Runtime provider portability | None. There is no provider contract or selection mechanism. |

Replacing Sendbird in Version 0 would require coordinated changes across app setup, shared components, order components, chat components, chat hooks, user constants, and dependency metadata. This is the least portable implementation.

## Version 1: Chat Facade

Version 1 is a partial portability improvement.

The most important improvement is that provider coupling moves out of non-chat application features. `App.tsx` now renders `ChatProvider` from `features/chat`. `Header` uses `useTotalUnreadMessages()`. `ListItem` uses `useOrderChatUnreadCount({ clientUserId })`. `OrderDetails` works with `ConversationId`, `ChatButton`, and `ChatModal` instead of Sendbird user ids and `channelUrl`.

This means app shell, shared UI, and order components no longer directly import Sendbird packages or manipulate Sendbird channel identifiers. That is a meaningful portability gain even though the direct import count remains 5 files.

The limitation is that the chat feature itself is still directly tied to Sendbird. The facade hooks call `useSendbird()`, create Sendbird group-channel queries, register Sendbird handlers, and return Sendbird channel URLs as app-owned `ConversationId` values. `ChatModal` still imports and renders Sendbird UIKit components directly.

Portability impact:

| Dimension | Assessment |
| --- | --- |
| App-feature portability | High compared with Version 0. Non-chat app features use app-owned chat APIs. |
| Chat-module portability | Medium-low. Sendbird SDK calls are centralized but not abstracted behind an adapter contract. |
| Provider UI portability | Medium-low. Provider UI is localized to `features/chat`, but still embedded in `ChatModal`. |
| Configuration portability | Medium. Provider config is isolated in the chat feature. |
| Runtime provider portability | None. There is no provider registry or runtime switching. |

Version 1 improves portability mostly by reducing provider leakage into application features. It does not make the chat module itself highly portable, because replacing Sendbird would still require editing the existing hooks and chat modal.

## Version 2: Provider Adapter

Version 2 is a stronger architectural portability improvement, but it is still not full portability.

The key difference from Version 1 is the explicit provider contract in `features/chat/core/chatTypes.ts`. Application-facing hooks depend on `ChatClient` through `useChatClient()`, and `ChatModal` depends on provider-supplied `ChatViews` through `useChatImplementation()`. The Sendbird-specific SDK calls, event handlers, UIKit components, and `channelUrl` mappings live under `features/chat/adapters/sendbird`.

This changes the meaning of the provider-specific reference count. Version 2 has 95 matches, which is higher than Version 1, but the references are concentrated in adapter-local implementation code. The higher count mostly reflects explicit adapter typing and implementation detail, not wider application leakage.

Adding another provider would still require real work: a new provider would need a `ChatClient`, `ChatViews`, provider composition, configuration, and dependency changes. However, the expected change area is now more formal and narrower than in Version 1. Header, order components, public chat hooks, and app-owned chat modal behavior should not need provider-specific edits if the new provider satisfies the same contracts.

Portability impact:

| Dimension | Assessment |
| --- | --- |
| App-feature portability | High. App shell, header, and order features stay provider-neutral. |
| Chat-module portability | Medium-high. Hooks and modal use provider-neutral contracts; Sendbird code is adapter-local. |
| Provider UI portability | Medium-high. UI is abstracted as `ChatViews`, although the only concrete views still use Sendbird UIKit. |
| Configuration portability | Medium. Config is isolated, but Sendbird is still the only configured provider. |
| Runtime provider portability | None. There is no runtime provider registry or user-selectable provider switch. |

Version 2 improves portability in the architecture of the chat module. It does not eliminate provider dependence entirely, because the project still includes Sendbird as the only implementation and dependency.

## Comparative Assessment

| Dimension | Version 0 | Version 1 | Version 2 | Degree of improvement |
| --- | --- | --- | --- | --- |
| App-feature portability | Low | High | High | Major improvement from Version 0 to Version 1; maintained in Version 2. |
| Chat-module portability | Low | Medium-low | Medium-high | Moderate improvement in Version 1; stronger improvement in Version 2 through contracts and adapter isolation. |
| Provider UI portability | Low | Medium-low | Medium-high | Partial improvement in Version 1; clearer boundary in Version 2 with `ChatViews`. |
| Configuration portability | Low | Medium | Medium | Improved in Version 1; mostly maintained in Version 2. |
| Dependency portability | Low | Low | Low | No meaningful improvement. All versions still depend on `@sendbird/uikit-react`. |
| Runtime provider switching | None | None | None | No meaningful improvement. None of the versions support runtime provider switching. |
| Replacement blast radius | High | Medium | Lower | Improves from cross-feature edits to chat-feature edits, then to adapter-focused edits. |

The biggest portability jump is from Version 0 to Version 1 for application features. Version 1 removes Sendbird knowledge from the app shell, header, and order components, which reduces the chance that a provider replacement would break unrelated product code.

The main portability jump from Version 1 to Version 2 is inside the chat module. Version 2 changes the internal boundary from a facade over Sendbird to a provider adapter model. This makes the intended replacement point clearer: implement the provider contracts rather than rewrite app-facing hooks and modal code.

## Conclusion

Portability does improve across the versions, but not as a single uniform trend.

Version 0 has low portability because provider details are spread through app setup, shared UI, order components, chat hooks, chat UI, and user constants.

Version 1 improves portability at the application-feature level. Header and order components no longer know Sendbird, but the chat module still directly depends on Sendbird SDK and UIKit.

Version 2 improves portability at the architectural boundary level. It introduces provider-neutral `ChatClient` and `ChatViews` contracts, and it localizes Sendbird-specific implementation details in an adapter. This is the strongest portability design among the three versions, but it is not full provider independence.

Remaining portability limits are still important:

- Sendbird is the only concrete provider configured.
- All versions still depend on `@sendbird/uikit-react`.
- `ConversationId` is still backed by a Sendbird channel URL internally.
- There is no runtime provider registry or provider switching mechanism.

Therefore, the evidence supports a nuanced conclusion: portability improves meaningfully from Version 0 to Version 1 in terms of application-feature decoupling, and improves further from Version 1 to Version 2 in terms of adapter-level architecture. It does not fully improve in dependency portability or runtime provider portability.
