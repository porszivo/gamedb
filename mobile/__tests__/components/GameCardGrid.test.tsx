import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GameCardGrid } from '@/components/library/GameCardGrid';
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
    },
  }),
}));

describe('GameCardGrid', () => {
  const mockGame: Game = {
    id: 1,
    name: 'The Legend of Zelda: Ocarina of Time',
    platforms: ['Nintendo 64', 'GameCube', 'Nintendo 3DS'],
    coverUrl: 'https://example.com/zelda.jpg',
    summary: 'An epic adventure',
    releaseDate: '1998-11-21',
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders game name', () => {
    const { getByText } = render(
      <GameCardGrid game={mockGame} onPress={mockOnPress} />
    );

    expect(getByText('The Legend of Zelda: Ocarina of Time')).toBeTruthy();
  });

  it('renders cover image when coverUrl provided', () => {
    const { UNSAFE_getByType } = render(
      <GameCardGrid game={mockGame} onPress={mockOnPress} />
    );

    const Image = require('react-native').Image;
    const image = UNSAFE_getByType(Image);
    expect(image.props.source.uri).toBe('https://example.com/zelda.jpg');
  });

  it('renders placeholder when no coverUrl', () => {
    const gameWithoutCover = { ...mockGame, coverUrl: undefined };
    const { getByText } = render(
      <GameCardGrid game={gameWithoutCover} onPress={mockOnPress} />
    );

    expect(getByText('🎮')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByRole } = render(
      <GameCardGrid game={mockGame} onPress={mockOnPress} />
    );

    const button = getByRole('button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('shows userPlatform badge when set', () => {
    const gameWithUserPlatform = { ...mockGame, userPlatform: 'Nintendo 64' };
    const { getByText } = render(
      <GameCardGrid game={gameWithUserPlatform} onPress={mockOnPress} />
    );

    expect(getByText('N64')).toBeTruthy();
  });

  it('limits displayed platforms to 2', () => {
    const { queryByText, getByText } = render(
      <GameCardGrid game={mockGame} onPress={mockOnPress} />
    );

    // Should show first 2 platforms and a "+1" indicator
    expect(getByText('N64')).toBeTruthy();
    expect(getByText('+1')).toBeTruthy();
  });

  it('has correct accessibility label', () => {
    const { getByLabelText } = render(
      <GameCardGrid game={mockGame} onPress={mockOnPress} />
    );

    expect(getByLabelText(/The Legend of Zelda/)).toBeTruthy();
  });

  it('truncates long game names to 2 lines', () => {
    const { getByText } = render(
      <GameCardGrid game={mockGame} onPress={mockOnPress} />
    );

    const nameText = getByText('The Legend of Zelda: Ocarina of Time');
    expect(nameText.props.numberOfLines).toBe(2);
  });
});
