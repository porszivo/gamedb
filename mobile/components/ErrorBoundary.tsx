import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { spacing, fontSize, fontWeight, borderRadius } from '@/theme/tokens';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service (z.B. Sentry)
    console.error('Error Boundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xxl,
      backgroundColor: colors.primary,
    },
    icon: {
      fontSize: 64,
      marginBottom: spacing.xl,
    },
    title: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    message: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xxl,
      lineHeight: 24,
    },
    errorDetails: {
      fontSize: fontSize.sm,
      color: colors.textTertiary,
      textAlign: 'center',
      marginBottom: spacing.xxl,
      fontFamily: 'monospace',
      backgroundColor: colors.tertiary,
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      maxWidth: '100%',
    },
    button: {
      backgroundColor: colors.accent,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xxl,
      borderRadius: borderRadius.md,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Etwas ist schiefgelaufen</Text>
      <Text style={styles.message}>
        Die App ist auf einen unerwarteten Fehler gestoßen. Bitte versuche es erneut.
      </Text>
      {__DEV__ && error && (
        <Text style={styles.errorDetails} numberOfLines={3}>
          {error.toString()}
        </Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={onReset}
        accessibilityLabel="App neu laden"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Erneut versuchen</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ErrorBoundaryClass;
