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
          size={26}
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
            size={26}
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
            size={26}
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
            size={26}
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
    paddingHorizontal: 20, // alineado con el contenido del dashboard
    paddingTop: 18,
    paddingBottom: 18,     // hace el header más alto
    marginBottom: 24,      // empuja el bloque de "Saldo total" hacia abajo
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 18,
  },
});
