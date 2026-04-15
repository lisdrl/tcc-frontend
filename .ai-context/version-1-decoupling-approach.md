# Version 1 Facade Approach

This file documents the decoupling approach implemented in `version-1`.

Version 1 uses a pragmatic chat facade to reduce Sendbird coupling across the OMS front end. It is an intermediate step between the highly coupled Version 0 implementation and a future, more provider-agnostic Version 2.

## Purpose

Version 1 centralizes chat-provider integration inside `version-1/src/features/chat`.

The goal is to stop order-management and shared UI components from depending directly on Sendbird SDK or Sendbird UIKit APIs. Those components now depend on app-owned chat APIs instead.

Version 1 intentionally does not fully abstract the chat provider. Sendbird remains the concrete provider internally, and Sendbird UIKit still renders the chat interface. The improvement is that Sendbird-specific details are localized to the chat feature/module.

## Approach Used

The main boundary is the public chat module API exported from:

```text
version-1/src/features/chat/index.ts
```

That barrel exports app-owned chat components, hooks, providers, and types:

- `ChatProvider`
- `ChatModal`
- `ChatButton`
- `useTotalUnreadMessages`
- `useOrderChatUnreadCount`
- `useStartOrderChat`
- `ConversationId`
- `OrderChatTarget`

Components outside `features/chat` should import from the chat module instead of importing Sendbird packages or reading Sendbird SDK state directly.

Internally, `features/chat` still uses Sendbird:

- `ChatProvider` wraps Sendbird UIKit provider setup.
- Chat hooks use `useSendbird()` to access the SDK.
- `ChatModal` renders Sendbird UIKit components.
- Sendbird `channelUrl` values are mapped to the app-owned `ConversationId` type at the chat boundary.

This keeps the refactor small and measurable while reducing provider leakage through the rest of the application.

## Where The Facade Is Used

The facade is used anywhere non-chat application code needs chat behavior.

### App Shell

File:

```text
version-1/src/App.tsx
```

`App.tsx` now renders `ChatProvider` from `features/chat` instead of importing `SendbirdProvider` directly.

This moves provider initialization, Sendbird UIKit CSS, app id, restaurant chat user id, and access token into:

```text
version-1/src/features/chat/providers/ChatProvider.tsx
version-1/src/features/chat/config/chatConfig.ts
```

### Header

File:

```text
version-1/src/components/Header/Header.tsx
```

`Header` now calls `useTotalUnreadMessages()` from the chat module.

Before Version 1, `Header` imported Sendbird handlers and subscribed directly to SDK events. In Version 1, the Sendbird-specific unread-count loading and subscriptions live inside:

```text
version-1/src/features/chat/hooks/useTotalUnreadMessages/index.ts
```

### Order List Item

File:

```text
version-1/src/features/orders/components/ListItem/ListItem.tsx
```

`ListItem` now calls `useOrderChatUnreadCount({ clientUserId })`.

Before Version 1, each order row created Sendbird group-channel queries, used `QueryType`, checked member ids, tracked channel URLs, and registered Sendbird group-channel handlers. In Version 1, that logic is centralized inside:

```text
version-1/src/features/chat/hooks/useOrderChatUnreadCount/index.ts
```

The order row only receives a number and renders the unread badge.

### Order Details

File:

```text
version-1/src/features/orders/components/OrderDetails/OrderDetails.tsx
```

`OrderDetails` now works with `conversationId` and app-owned chat components.

It no longer imports a Sendbird-named user constant, passes provider-specific user ids to `ChatButton`, or stores a variable named `channelUrl`. Starting/opening the chat is delegated to the chat facade through `ChatButton` and `useStartOrderChat()`.

### Chat UI Boundary

File:

```text
version-1/src/features/chat/components/ChatModal/ChatModal.tsx
```

`ChatModal` exposes a provider-neutral public prop named `conversationId`, but internally passes it to Sendbird UIKit as `channelUrl`.

This is a facade boundary, not a full provider abstraction. The rest of the app sees an application conversation id; the chat module knows that, for this version, the id is backed by a Sendbird channel URL.

## Facade Operations

Version 1 should be described as a facade implementation.

It does not introduce a provider registry, pure provider adapter, or runtime provider-switching contract. The React hooks inside the chat module are the facade operations used by the rest of the app:

```text
version-1/src/features/chat/hooks
```

- `useStartOrderChat`
  - Starts or opens the restaurant/client conversation.
  - Internally calls Sendbird `sdk.groupChannel.createChannel`.
  - Preserves `isDistinct: true`.
  - Returns an app-owned `ConversationId`.

- `useTotalUnreadMessages`
  - Loads the total unread message count.
  - Registers Sendbird user and group-channel event handlers.
  - Exposes `{ count, isLoading, error }` to app components.

- `useOrderChatUnreadCount`
  - Finds the conversation for a client user.
  - Loads that conversation's unread message count.
  - Registers Sendbird group-channel handlers for unread updates.
  - Exposes `{ count, isLoading, error }` to the order row.

For the thesis classification, these hooks should be treated as facade methods. This is intentional: Version 1 focuses on creating a simpler app-owned interface over Sendbird, while a more formal provider adapter belongs more naturally to Version 2.

## Benefits

Version 1 improves the codebase in several concrete ways:

- Sendbird imports are localized to `version-1/src/features/chat`.
- Shared UI and order-management components no longer know Sendbird SDK/UIKit concepts.
- Provider-specific event handlers, query objects, and SDK calls are hidden behind app-owned hooks.
- App code uses domain-oriented names such as `conversationId` instead of `channelUrl`.
- The app shell no longer initializes Sendbird directly.
- The behavior remains close to Version 0, making the experiment easier to compare.
- Future provider changes would start mostly in `features/chat` instead of touching header and order components.

## Remaining Coupling / Caveats

Version 1 still has intentional provider coupling:

- Sendbird UIKit still renders the chat UI inside `ChatModal`.
- `conversationId` is internally backed by a Sendbird `channelUrl`.
- Sendbird event handlers and query types still exist inside chat hooks.
- `isDistinct: true` is preserved, so conversations remain participant-based, not order-based.
- Chat provider credentials/config are localized in the chat module but still live in client-side code.
- There is no runtime provider switching.
- There is no full provider-agnostic interface or adapter contract yet.

These caveats are acceptable for Version 1 because the purpose is incremental decoupling, not complete portability.

## Suggested Measurement

Useful scans for evaluating Version 1:

```sh
rg "@sendbird" version-1/src
rg "Sendbird|SENDBIRD|useSendbird|GroupChannel|QueryType|UserEventHandler|channelUrl" version-1/src
```

Expected result:

- Provider-specific references should be contained inside `version-1/src/features/chat`.
- `components/Header` should not import Sendbird packages.
- `features/orders` should not import Sendbird packages or Sendbird-named constants.
- `channelUrl` should appear only as an internal Sendbird UIKit mapping inside chat code, if it appears at all.

Also verify the implementation with:

```sh
cd version-1
npm run lint
npm run build
```

The production build may still warn about large chunks because Sendbird UIKit remains bundled in Version 1.
