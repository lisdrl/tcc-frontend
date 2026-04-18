# Version 2 Provider Adapter Approach

This file documents the decoupling approach implemented in `version-2`.

Version 2 builds on the Version 1 facade by introducing an explicit provider adapter contract. The rest of the OMS front end still imports app-owned chat components, hooks, providers, and types, but the chat module now separates provider-neutral contracts from the concrete Sendbird implementation.

## Purpose

Version 2 makes the chat feature more provider-agnostic than Version 1.

The goal is to keep order-management and shared UI components independent from Sendbird SDK and Sendbird UIKit APIs, while also reducing Sendbird coupling inside the chat module itself. Instead of having the public hooks call `useSendbird()` directly, the hooks depend on a provider-neutral `ChatClient` contract.

Sendbird remains the configured provider in this version. The important change is architectural: Sendbird-specific behavior is isolated behind an adapter that satisfies app-owned chat contracts.

## Approach Used

The main contract boundary lives in:

```text
version-2/src/features/chat/core/chatTypes.ts
```

That file defines the provider-neutral chat types:

- `ChatClient`
- `ChatViews`
- `ChatImplementation`
- `ConversationId`
- `OrderChatTarget`
- `ChatCountState`
- `Unsubscribe`

`ChatClient` is the service-side contract for chat behavior. It defines operations for unread counts, subscriptions, and starting an order chat.

`ChatViews` is the UI-side contract for provider-owned chat UI pieces. It defines the conversation list and conversation view components expected by the app-owned chat modal.

`ChatImplementation` combines both sides:

```text
client: ChatClient
views: ChatViews
```

The active implementation is stored in React context through:

```text
version-2/src/features/chat/core/ChatContext.ts
version-2/src/features/chat/core/ChatImplementationProvider.tsx
version-2/src/features/chat/core/useChatImplementation.ts
version-2/src/features/chat/core/useChatClient.ts
```

This makes Version 2 closer to a provider adapter pattern than Version 1. The application code consumes the same chat feature API, while the provider-specific work lives under:

```text
version-2/src/features/chat/adapters/sendbird
```

## Sendbird Adapter

The Sendbird adapter is the concrete provider implementation for Version 2.

### Client Factory

File:

```text
version-2/src/features/chat/adapters/sendbird/createSendbirdChatClient.ts
```

`createSendbirdChatClient()` is a function factory that receives Sendbird runtime dependencies and returns a `ChatClient`:

```text
createSendbirdChatClient({ sdk, currentUserId }): ChatClient
```

This is the functional equivalent of a class implementing an interface. The returned object contains provider-neutral methods, while the function body contains the Sendbird-specific SDK calls, event handlers, channel queries, and `channelUrl` mapping.

The factory implements:

- `getTotalUnreadCount`
- `subscribeToTotalUnreadCount`
- `getOrderChatUnreadCount`
- `subscribeToOrderChatUnreadCount`
- `startOrderChat`

### View Factory

File:

```text
version-2/src/features/chat/adapters/sendbird/SendbirdChatViews.tsx
```

`createSendbirdChatViews()` returns a `ChatViews` object backed by Sendbird UIKit:

- `ConversationList` wraps `SendbirdGroupChannelList`.
- `Conversation` wraps `SendbirdGroupChannel`.
- Sendbird `channel.url` values are mapped to app-owned `ConversationId` values at the adapter boundary.

This keeps Sendbird UIKit components out of the app-owned `ChatModal`.

### Provider Composition

File:

```text
version-2/src/features/chat/adapters/sendbird/SendbirdChatProvider.tsx
```

`SendbirdChatProvider` composes the concrete provider:

- wraps the subtree in Sendbird UIKit's `SendbirdProvider`;
- reads the Sendbird SDK through `useSendbird()`;
- creates a `ChatImplementation` with the Sendbird client and views;
- exposes that implementation through `ChatImplementationProvider`.

The app-facing provider remains:

```text
version-2/src/features/chat/providers/ChatProvider.tsx
```

That file chooses Sendbird as the concrete provider, but consumers outside the chat module do not import Sendbird directly.

## Where The Contract Is Used

The Version 2 public chat module API is exported from:

```text
version-2/src/features/chat/index.ts
```

It exports the same kind of app-owned surface used by application code:

- `ChatProvider`
- `ChatModal`
- `ChatButton`
- `useTotalUnreadMessages`
- `useOrderChatUnreadCount`
- `useStartOrderChat`
- chat domain types from `core`

The hooks no longer use Sendbird directly:

```text
version-2/src/features/chat/hooks/useTotalUnreadMessages/index.ts
version-2/src/features/chat/hooks/useOrderChatUnreadCount/index.ts
version-2/src/features/chat/hooks/useStartOrderChat/index.ts
```

Instead, they call `useChatClient()` and delegate behavior to the configured `ChatClient`.

The chat modal no longer renders Sendbird UIKit components directly:

```text
version-2/src/features/chat/components/ChatModal/ChatModal.tsx
```

Instead, it reads `ConversationList` and `Conversation` from `useChatImplementation().views`.

## Benefits

Version 2 improves the codebase beyond Version 1 in several concrete ways:

- Sendbird SDK calls are isolated inside the Sendbird adapter client.
- Sendbird UIKit components are isolated inside the Sendbird adapter views.
- Chat hooks depend on `ChatClient`, not on `useSendbird()`.
- `ChatModal` depends on `ChatViews`, not on Sendbird UIKit components.
- The app-owned `ConversationId` name remains the public concept, while Sendbird `channelUrl` stays internal to the adapter.
- A future provider could be introduced by implementing `ChatClient`, `ChatViews`, and a provider component that supplies `ChatImplementation`.
- The design is easier to classify as a provider adapter than Version 1's facade-only approach.

## Remaining Coupling / Caveats

Version 2 is more decoupled, but it is not completely provider-independent:

- Sendbird is still the only concrete implementation configured by `ChatProvider`.
- Sendbird UIKit still controls the rendered conversation list and conversation UI.
- `ConversationId` is still backed by Sendbird channel URLs internally.
- `isDistinct: true` is preserved, so conversations remain participant-based, not order-based.
- Chat provider credentials/config are still client-side constants.
- There is no runtime provider registry or end-user provider switching.
- The adapter contract is specific to the current application needs, not a general chat abstraction.

These caveats are acceptable for Version 2 because the purpose is to demonstrate a clearer provider adapter boundary without changing the product behavior.

## Suggested Measurement

Useful scans for evaluating Version 2:

```sh
rg "@sendbird" version-2/src
rg "Sendbird|SENDBIRD|useSendbird|GroupChannel|QueryType|UserEventHandler|channelUrl" version-2/src
```

Expected result:

- Provider-specific references should be concentrated in `version-2/src/features/chat/adapters/sendbird`, plus provider configuration inside the chat module.
- Shared components, order-management components, and public chat hooks should not import Sendbird packages.
- `ChatModal` should render provider-supplied views instead of importing Sendbird UIKit directly.
- `channelUrl` should appear only as an internal Sendbird mapping detail, not as a public app concept.

Also verify the implementation with:

```sh
cd version-2
npm run lint
npm run build
```

The production build may still warn about large chunks because Sendbird UIKit remains bundled in Version 2.
