import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameCardList } from '@/components/library/GameCardList';
import { Game } from '@/store/useGameStore';

// Mock the theme hook
jest.mock('@/theme/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#000000',
      secondary: '#1a1a1a',
      tertiary: '#2a2a2a',
      textPrimary: '#ffffff',
      textSecondary: '#888888',
      textTertiary: '#666666',
      error: '#ff0000',
    },
  }),
}));

describe('GameCardList', () => {
  const mockGame: Game = {
    id: 1,
    name: 'Super Mario Bros',
    platforms: ['NES', 'SNES', 'Game Boy Advance'],
    coverUrl: 'https://example.com/mario.jpg',
    summary: 'A classic platformer',
    releaseDate: '1985-09-13',
  };

  const mockOnPress = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders game name', () => {
    const { getByText } = render(
      <GameCardList game={mockGame} onPress={mockOnPress} />
    );

    expect(getByText('Super Mario Bros')).toBeTruthy();
  });

  it('renders cover image when coverUrl provided', () => {
    const { UNSAFE_getByType } = render(
      <GameCardList game={mockGame} onPress={mockOnPress} />
    );

    const Image = require('react-native').Image;
    const image = UNSAFE_getByType(Image);
    expect(image.props.source.uri).toBe('https://example.com/mario.jpg');
  });

  it('renders placeholder when no coverUrl', () => {
    const gameWithoutCover = { ...mockGame, coverUrl: undefined };
    const { getByText } = render(
      <GameCardList game={gameWithoutCover} onPress={mockOnPress} />
    );

    expect(getByText('🎮')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByRole } = render(
      <GameCardList game={mockGame} onPress={mockOnPress} />
    );

    const button = getByRole('button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('shows userPlatform badge when set', () => {
    const gameWithUserPlatform = { ...mockGame, userPlatform: 'NES' };
    const { getByText } = render(
      <GameCardList game={gameWithUserPlatform} onPress={mockOnPress} />
    );

    expect(getByText('NES')).toBeTruthy();
  });

  it('shows platform badges when no userPlatform', () => {
    const { getByText } = render(
      <GameCardList game={mockGame} onPress={mockOnPress} />
    );

    // Should show short names for platforms
    expect(getByText('NES')).toBeTruthy();
  });

  it('has correct accessibility label', () => {
    const { getByLabelText } = render(
      <GameCardList game={mockGame} onPress={mockOnPress} />
    );

    expect(getByLabelText(/Super Mario Bros/)).toBeTruthy();
  });

  it('renders without delete handler (no swipeable)', () => {
    const { getByText } = render(
      <GameCardList game={mockGame} onPress={mockOnPress} />
    );

    expect(getByText('Super Mario Bros')).toBeTruthy();
  });

  it('renders with delete handler (swipeable enabled)', () => {
    const { getByText } = render(
      <GameCardList
        game={mockGame}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText('Super Mario Bros')).toBeTruthy();
  });
});
