// mobile/src/components/AppHeader.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type AppHeaderProps = {
  isBalanceHidden: boolean;
  onToggleBalanceHidden: () => void;
  onNotificationsPress?: () => void;
  onHelpPress?: () => void;
  onProfilePress?: () => void;
};

export default function AppHeader({
  isBalanceHidden,
  onToggleBalanceHidden,
  onNotificationsPress,
  onHelpPress,
  onProfilePress,
}: AppHeaderProps) {
  return (
    <View style={styles.headerRow}>
      {/* Campana (notificaciones) */}
      <TouchableOpacity
        onPress={onNotificationsPress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name="notifications-outline"
          size={22}
          color="#0b1a3b"
        />
      </TouchableOpacity>

      {/* Ojo, ayuda, perfil + */}
      <View style={styles.headerRight}>
        <TouchableOpacity
          onPress={onToggleBalanceHidden}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.iconButton}
        >
          <Ionicons
            name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#0b1a3b"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onHelpPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.iconButton}
        >
          <Ionicons
            name="help-circle-outline"
            size={22}
            color="#0b1a3b"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onProfilePress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.iconButton}
        >
          <Ionicons
            name="person-add-outline"
            size={22}
            color="#0b1a3b"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 14,
  },
});
