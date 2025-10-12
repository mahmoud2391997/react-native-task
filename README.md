# 3 Pages Store - React Native Coding Challenge

A React Native Expo app demonstrating authentication, auto-lock with biometrics, product management, and offline-first architecture using MMKV and React Query.

## Features

- **Authentication**: DummyJSON login with session persistence
- **Auto-Lock**: Locks after 10 seconds of inactivity or when app goes to background
- **Biometric Unlock**: Face ID/Touch ID with password fallback
- **Product Management**: Browse all products and category-specific products
- **Superadmin**: Delete products (simulated) when logged in as superadmin
- **Offline-First**: React Query cache persisted to MMKV for instant load and offline access
- **Network Detection**: Visual indicator when offline

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Run on iOS Simulator:
```bash
Press 'i' in the terminal
```

5. Run on Android Emulator:
```bash
Press 'a' in the terminal
```

6. Run on Web (limited biometrics support):
```bash
Press 'w' in the terminal
```

## Configuration

### Chosen Category
The app displays products from the **laptops** category in the Category tab.

**Location**: `constants/config.ts`
```typescript
export const CHOSEN_CATEGORY = 'laptops';
```

### Superadmin User
The superadmin user is **emilys**.

**Location**: `constants/config.ts`
```typescript
export const SUPERADMIN_USERNAME = 'emilys';
```

When logged in as `emilys`, the delete button appears on product cards in the All Products screen.

### Test Credentials

You can use any DummyJSON credentials:

- **Username**: `emilys`
- **Password**: `emilyspass`

Other test users:
- Username: `michaelw`, Password: `michaelwpass`
- Username: `sophiab`, Password: `sophiabpass`

See [DummyJSON Users](https://dummyjson.com/users) for more credentials.

## Project Structure

```
project/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # All Products tab
│   │   ├── category.tsx          # Laptops tab
│   │   └── logout.tsx            # Sign Out tab
│   ├── login/                    # Login route
│   │   └── index.tsx
│   └── _layout.tsx               # Root layout with providers
├── components/                   # Reusable components
│   ├── ui/                       # UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── ProductCard.tsx
│   └── LockOverlay.tsx           # Biometric lock screen
├── screens/                      # Screen components
│   ├── Login/
│   ├── AllProducts/
│   └── Category/
├── store/                        # Redux Toolkit
│   ├── slices/
│   │   ├── authSlice.ts          # Authentication state
│   │   └── appSlice.ts           # App state (lock, network)
│   ├── hooks/
│   │   └── index.ts              # Typed Redux hooks
│   └── index.ts                  # Store configuration
├── services/                     # API services
│   └── api.ts                    # DummyJSON API client
├── hooks/                        # Custom hooks
│   ├── useAutoLock.ts            # Auto-lock timer
│   ├── useNetworkStatus.ts       # Network detection
│   └── useFrameworkReady.ts      # Framework initialization
├── utils/                        # Utilities
│   ├── mmkv.ts                   # MMKV storage wrapper
│   ├── queryClient.ts            # React Query config
│   └── biometrics.ts             # Biometric auth helpers
├── types/                        # TypeScript types
│   └── index.ts
└── constants/                    # Configuration
    └── config.ts                 # App constants
```

## Architecture

### State Management
- **Redux Toolkit**: Global state for auth and app (lock, network)
- **MMKV**: Persistent storage for Redux state and React Query cache
- **React Query**: Server state with automatic caching and offline support

### Authentication Flow
1. User enters credentials on Login screen
2. App calls `/auth/login` endpoint
3. Access token stored in Redux and MMKV
4. Token automatically applied to all API requests
5. On app relaunch, token is restored and validated with `/auth/me`
6. If valid token exists, biometric lock screen shown

### Auto-Lock Flow
1. App starts 10-second inactivity timer on mount
2. Timer resets on user interaction
3. When timer expires or app goes to background, lock screen shown
4. Biometric authentication required to unlock
5. Password fallback available if biometrics unavailable

### Data Caching
1. React Query fetches data from DummyJSON API
2. Results cached in memory and persisted to MMKV
3. On cold start, cached data loaded instantly
4. App remains functional offline with cached data
5. Pull-to-refresh syncs when online

## API Endpoints Used

- `POST /auth/login` - User authentication
- `GET /auth/me` - Session validation
- `GET /products?limit=100` - All products
- `GET /products/category/laptops` - Category products
- `DELETE /products/{id}` - Delete product (simulated)

## Trade-offs

### What I Prioritized
1. **Architecture**: Clean separation of concerns with proper layering (screens, components, services, store)
2. **Type Safety**: Comprehensive TypeScript types throughout the app
3. **Offline-First**: MMKV persistence for both Redux and React Query ensures instant load and offline access
4. **Modern UI**: Clean, professional design with proper spacing, shadows, and visual hierarchy
5. **Code Quality**: Modular components, custom hooks, and clear file organization

### What I Would Improve With More Time
1. **Testing**: Add Jest unit tests and React Native Testing Library integration tests
2. **Error Handling**: More robust error states with retry mechanisms and better user feedback
3. **Animations**: Smooth transitions between screens and interactive micro-animations
4. **Optimizations**:
   - Implement virtualized lists for better performance with large datasets
   - Add image caching for product thumbnails
   - Optimize bundle size with code splitting
5. **Features**:
   - Product search and filtering
   - Product detail screen with full information
   - Shopping cart functionality
   - Multiple category support
   - User profile management
6. **Security**:
   - Secure token storage with encrypted MMKV
   - Token refresh mechanism
   - Rate limiting on failed login attempts
7. **UX Enhancements**:
   - Skeleton loaders during data fetching
   - Toast notifications instead of alerts
   - Swipe gestures for product actions
   - Dark mode support

## Technologies Used

### Required
- **React Native**: Mobile framework
- **TypeScript**: Type safety
- **Expo**: Development platform
- **Expo Router**: File-based routing
- **Redux Toolkit**: State management
- **React Query**: Server state management
- **MMKV**: High-performance storage

### Additional
- **Axios**: HTTP client
- **React Navigation**: Navigation library (via Expo Router)
- **Lucide React Native**: Icon library
- **Expo Local Authentication**: Biometrics
- **NetInfo**: Network detection
- **React Native Gesture Handler**: Touch interactions
- **Expo Blur**: Lock overlay blur effect

## Known Limitations

1. **Web Platform**: Biometric authentication not available on web, falls back to password only
2. **Delete Simulation**: Product deletion is simulated by DummyJSON API and not persisted
3. **Token Expiry**: No automatic token refresh implemented
4. **Network Errors**: Limited retry logic for failed requests
5. **Image Loading**: No placeholder or loading states for product images

## Performance Considerations

- React Query cache persisted to MMKV for instant cold starts
- Product images loaded lazily with React Native's Image component
- Efficient re-renders with Redux selectors and React.memo where needed
- FlatList for efficient list rendering
- Auto-lock timer properly cleaned up on unmount

## License

MIT
