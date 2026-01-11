// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  router: {
    push: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  },
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    Swipeable: View,
    GestureHandlerRootView: View,
    PanGestureHandler: View,
  };
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Silence console warnings in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('Animated')) return;
  originalWarn.call(console, ...args);
};
