# Sendbird Coupling Map

This file documents where the current Version 0 code is coupled to Sendbird. Use it as the baseline map when measuring refactoring cost.

## App Shell Coupling

File: `original-frontend/src/App.tsx`

- Imports `SendbirdProvider` from `@sendbird/uikit-react/SendbirdProvider`.
- Imports Sendbird UIKit CSS globally.
- Hardcodes the Sendbird app id.
- Hardcodes a Sendbird access token.
- Uses `SENDBIRD_USER_ID` directly.

## Header Coupling

File: `original-frontend/src/components/Header/Header.tsx`

- Imports `useSendbird` from `@sendbird/uikit-react`.
- Imports `UserEventHandler` from `@sendbird/chat`.
- Imports `GroupChannelHandler` from `@sendbird/chat/groupChannel`.
- Reads the Sendbird SDK from UIKit state.
- Calls `sdk.groupChannel.getTotalUnreadMessageCount()`.
- Registers Sendbird user and group-channel handlers.
- Removes Sendbird handlers during cleanup.

## Order Row Coupling

File: `original-frontend/src/features/orders/components/ListItem/ListItem.tsx`

- Imports `useSendbird` from `@sendbird/uikit-react`.
- Imports `GroupChannelHandler` and `QueryType` from `@sendbird/chat/groupChannel`.
- Imports `SENDBIRD_USER_ID`.
- Creates Sendbird group-channel list queries.
- Uses Sendbird member ids to identify the relevant chat.
- Stores and compares Sendbird channel URLs.
- Registers Sendbird group-channel event handlers.

## Order Details Coupling

File: `original-frontend/src/features/orders/components/OrderDetails/OrderDetails.tsx`

- Imports `SENDBIRD_USER_ID`.
- Passes Sendbird user id into `ChatButton`.
- Stores `channelUrl` in React state.
- Passes `channelUrl` into `ChatModal`.

## Chat Button Coupling

File: `original-frontend/src/features/chat/components/ChatButton/ChatButton.tsx`

- Calls `useCreateChannel`.
- Uses provider-oriented prop names such as `onCreateChannel`.
- Exposes the resulting URL to the caller.

## Channel Creation Hook Coupling

File: `original-frontend/src/features/chat/hooks/useCreateChannel/index.ts`

- Imports `useSendbird` from `@sendbird/uikit-react`.
- Reads the Sendbird SDK from UIKit state.
- Calls `sdk.groupChannel.createChannel`.
- Uses Sendbird `invitedUserIds`.
- Uses `isDistinct: true`.
- Returns the Sendbird channel URL.
- Contains debug `console.log` statements.

## Chat Modal Coupling

File: `original-frontend/src/features/chat/components/ChatModal/ChatModal.tsx`

- Imports `GroupChannelList` from Sendbird UIKit.
- Imports `GroupChannel` from Sendbird UIKit.
- Imports Sendbird `GroupChannel` type.
- Stores Sendbird channel objects in component state.
- Passes Sendbird channel URLs to UIKit components.

File: `original-frontend/src/features/chat/components/ChatModal/ChatModal.styles.ts`

- Styles Sendbird UIKit internal class names.

## User Constant Coupling

File: `original-frontend/src/features/users/constants/index.ts`

- Stores the current chat user as `SENDBIRD_USER_ID`.
- Leaks the provider name into app/domain code.

## Dependency Coupling

Files:

- `original-frontend/package.json`
- `version-1/package.json`

Current dependency:

- `@sendbird/uikit-react`

During decoupling, the dependency can remain installed while direct imports are moved behind a provider adapter.
