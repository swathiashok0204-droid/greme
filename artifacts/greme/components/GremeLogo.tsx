import { Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function GremeLogo({ compact = false }: { compact?: boolean }) {
  const colors = useColors();
  return (
    <View>
      <Text
        style={{
          color: colors.forest,
          fontFamily: 'Inter_700Bold',
          fontSize: compact ? 24 : 32,
          letterSpacing: -1.2,
        }}
      >
        grème
      </Text>
      {!compact ? (
        <Text
          style={{
            color: colors.mutedForeground,
            fontFamily: 'Inter_500Medium',
            fontSize: 10,
            letterSpacing: 2.2,
            textTransform: 'uppercase',
          }}
        >
          shop beautifully.
        </Text>
      ) : null}
    </View>
  );
}