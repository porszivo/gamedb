import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmptyLibraryState } from '@/components/library/EmptyLibraryState';

// Mock the theme hook
jest.mock('@/theme/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#000000',
      secondary: '#1a1a1a',
      tertiary: '#2a2a2a',
      textPrimary: '#ffffff',
      textSecondary: '#888888',
      accent: '#007AFF',
    },
  }),
}));

describe('EmptyLibraryState', () => {
  const mockOnAddGames = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state message', () => {
    const { getByText } = render(
      <EmptyLibraryState onAddGames={mockOnAddGames} />
    );

    expect(getByText('No Games Yet')).toBeTruthy();
  });

  it('renders add games button', () => {
    const { getByRole } = render(
      <EmptyLibraryState onAddGames={mockOnAddGames} />
    );

    expect(getByRole('button')).toBeTruthy();
  });

  it('calls onAddGames when button pressed', () => {
    const { getByRole } = render(
      <EmptyLibraryState onAddGames={mockOnAddGames} />
    );

    fireEvent.press(getByRole('button'));

    expect(mockOnAddGames).toHaveBeenCalledTimes(1);
  });

  it('renders icon', () => {
    const { getByText } = render(
      <EmptyLibraryState onAddGames={mockOnAddGames} />
    );

    // Check for emoji icon
    expect(getByText('🎮')).toBeTruthy();
  });
});
