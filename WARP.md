# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

CookedGPT Frontend is a React Native Expo application that provides AI-powered text transformation services. Users can input text, select transformation styles (tags), choose AI models, and get transformed output. The app uses Clerk for authentication and supports multiple AI providers (OpenAI, Gemini, OpenRouter).

## Development Commands

### Essential Commands
```bash
# Start development server
npm start

# Start with specific platforms
expo run:android    # Android development
expo run:ios        # iOS development
expo start --web    # Web development

# Code quality
npm run lint        # Run ESLint

# Reset project (if needed)
npm run reset-project
```

### Testing Individual Components
Since this is a React Native app, use the Expo development server to test individual screens/components by navigating to them within the app.

## Architecture Overview

### Core Application Structure
- **Expo Router**: File-based routing with authenticated and tab-based navigation
- **State Management**: Recoil for global state, React Query (TanStack Query) for server state
- **Authentication**: Clerk with token-based API authentication
- **Styling**: NativeWind (Tailwind CSS for React Native) with custom design system
- **Navigation**: 
  - Authenticated routes: `(auth)/auth.tsx`
  - Main app: `(tabs)/` with Transform, History, Settings, Profile screens

### Key Data Models
- **Model**: AI model configurations with type (OPENAI/GEMINI/OPENROUTER), performance metrics
- **Transformation**: User transformations with input/output, tags, model info, timestamps
- **ApiKey**: User API keys for different AI providers

### API Integration
- Base URL configured per environment in axios defaults
- All API calls use Bearer token authentication from Clerk
- Infinite queries for paginated data (transformations, models)
- Real-time progress animations during API calls

### Styling System
The app uses a comprehensive design system defined in `tailwind.config.js`:
- Custom color palette with semantic naming (primary, text, background, border, state)
- Custom font families (Poppins variants)
- Transformation-specific colors (pro, savage, genz, insult styles)
- Responsive design patterns for mobile-first development

## Key Implementation Patterns

### Authentication Flow
All screens check `userId` from Clerk and redirect to auth if not authenticated. API calls use tokens from `getToken()` method.

### Infinite Scrolling
History and model selection use React Query's infinite queries with pagination. Pattern:
```typescript
useInfiniteQuery({
  queryKey: ['resource', filters],
  queryFn: ({ pageParam = 1 }) => apiCall(pageParam),
  getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined
})
```

### Animation Patterns
Extensive use of React Native Animated for:
- Screen entrance animations (fade + slide)
- Loading states with progress bars
- Interactive feedback for user actions

### Component Organization
- `components/ui/`: Reusable UI components (buttons, cards, selectors)
- `components/modals/`: Modal components
- `components/others/`: Feature-specific components
- `interfaces/`: TypeScript type definitions
- `api/`: API configuration and utilities

## Environment Setup

Required environment variables (see `.env.example`):
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk authentication key
- `EXPO_PUBLIC_API_URL`: Backend API base URL

## Build Configuration Notes

- **Metro Config**: Configured for NativeWind, Reanimated, and SVG support
- **Babel**: Supports Expo preset with NativeWind and Reanimated plugins
- **TypeScript**: Strict mode enabled with path aliases (`@/*` for root)
- **New Architecture**: Expo new architecture enabled for performance

## Development Context

The app transforms text using different AI models and styles. Main user flows:
1. **Transform**: Input text → Select tags/style → Choose AI model → Get transformed output
2. **History**: Browse/search past transformations with filtering by tags
3. **Settings**: Configure preferences and API keys
4. **Profile**: User account management

The hardcoded API base URL (`http://192.168.1.111:4000/api/v1`) suggests local development setup - update this for production deployments.
