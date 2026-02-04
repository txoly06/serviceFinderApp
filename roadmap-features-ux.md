# Roadmap: Features & UX Improvements

## Goal
Implement structured features (Chat, Maps, Notifications) and UX polish (Skeleton, Toasts, Animations) to elevate app quality.

## Phase 1: Interactivity & Real-time (Features)
- [x] **Chat System Backend**: Created Conversation.js, chatController.js with CRUD, routes/chat.js
- [x] **Chat UI**: Created TelaConversas.tsx and TelaChat.tsx with HTTP polling
- [x] **Push Notifications**: Created servicos/notifications.ts with expo-notifications
- [x] **Interactive Map**: Configured `MapaServicos.tsx` using `react-native-maps` + Mapbox URL support
- [x] **Profile Editing**: Backend PUT `/api/users/profile` + API functions
- [x] **Favorites System**: Added `favorites` to User model + full CRUD

## Phase 2: Visual Polish & UX (Experience)
- [x] **Skeleton Loading**: Created `SkeletonCard` component, applied to TelaInicio
- [x] **Toast System**: Created ToastProvider + useToast hook, integrated in App.tsx
- [x] **Smart Search**: Created useDebounce + useSearchHistory hooks
- [x] **Rich Empty States**: Created EmptyState.tsx with presets for common scenarios
- [x] **Micro-animations**: Included in Toast and Skeleton components

## Done When
- [x] Users can chat in HTTP mode (polling every 5s)
- [x] Services can be viewed on a map
- [x] Loading states are smooth (Skeleton instead of spinner)
- [x] User can edit their own profile
- [x] Push notifications configured and ready
