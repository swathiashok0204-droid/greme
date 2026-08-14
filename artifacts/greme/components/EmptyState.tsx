import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const colors = useColors();
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingVertical: 44,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.secondary,
          borderRadius: 36,
          height: 72,
          justifyContent: 'center',
          marginBottom: 18,
          width: 72,
        }}
      >
        <Feather name="shopping-bag" size={25} color={colors.forest} />
      </View>
      <Text
        style={{
          color: colors.foreground,
          fontFamily: 'Inter_700Bold',
          fontSize: 18,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: colors.mutedForeground,
          fontFamily: 'Inter_400Regular',
          fontSize: 14,
          lineHeight: 21,
          marginTop: 8,
          maxWidth: 300,
          textAlign: 'center',
        }}
      >
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => ({
            backgroundColor: colors.forest,
            borderRadius: 22,
            marginTop: 20,
            opacity: pressed ? 0.78 : 1,
            paddingHorizontal: 20,
            paddingVertical: 12,
          })}
        >
          <Text
            style={{
              color: colors.white,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 13,
            }}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}