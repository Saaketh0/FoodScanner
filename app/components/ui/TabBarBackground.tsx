import { PlatformPressable } from '@react-navigation/elements';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { useColorScheme as _useColorScheme, StyleProp, ViewStyle } from 'react-native';

// This is a shim for web and Android where the tab bar is generally opaque.
export default undefined;

export function useBottomTabOverflow() {
  return 0;
}

export const HapticTab = PlatformPressable;

export const Colors = {
  light: {
    tint: '#0a7ea4',
    background: '#fff',
    text: '#000',
  },
  dark: {
    tint: '#fff',
    background: '#000',
    text: '#fff',
  },
};

export type IconSymbolProps = SymbolViewProps & {
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function IconSymbol({ size = 24, style, ...rest }: IconSymbolProps) {
  return <SymbolView {...rest} style={[{ width: size, height: size }, style]} />;
}

export function useColorScheme() {
  return _useColorScheme();
}
