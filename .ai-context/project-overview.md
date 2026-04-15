# Project Overview

This repository is the practical part of an MBA final project about decoupling chat providers in front-end applications built with React and TypeScript.

The application is an Order Management System (OMS) for restaurants. Restaurants can view customer orders, select an order, and communicate with the end customer through chat. The current chat provider is Sendbird.

## Research Goal

Compare three implementations of the same OMS:

- Version 0: original implementation with chat highly coupled to Sendbird.
- Version 1: first decoupling approach.
- Version 2: second decoupling approach.

The comparison focuses on:

- Portability.
- Refactoring cost.
- Code complexity and maintainability.
- Performance.

## Domain Language

Use provider-neutral language outside provider-specific adapters:

- "chat provider" instead of "Sendbird" when discussing architecture.
- "conversation" instead of "channel" in application code.
- "conversation id" instead of "channel URL" in application code.
- "restaurant user" or "current chat user" instead of "Sendbird user".
- "client user" for the end customer.
- "order chat" for the conversation associated with an order.

## Current Product Behavior

The current behavior should be preserved during decoupling unless a task explicitly changes product requirements:

- The app wraps the entire UI in Sendbird UIKit provider.
- The header shows total unread chat messages.
- Each order row can show an unread count for that order/client conversation.
- "Ver chats" opens a modal with the chat list.
- "Abrir chat" starts or opens a single conversation with the selected order client.
- Sendbird currently creates distinct group channels using the restaurant user id and client id.

Important: the current `isDistinct: true` behavior creates one conversation per participant pair, not necessarily one conversation per order. Confirm requirements before changing that behavior.
