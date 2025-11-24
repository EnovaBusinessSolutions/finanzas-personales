// mobile/src/screens/Settings.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { COLORS } from '../theme/colors';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ajustes</Text>
          <Text style={styles.headerSubtitle}>
            Personaliza cómo quieres usar tu app financiera.
          </Text>
        </View>

        {/* Sección: Perfil */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Perfil</Text>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.itemTitle}>Nombre</Text>
              <Text style={styles.itemSubtitle}>Jose Manuel</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.itemTitle}>Correo</Text>
              <Text style={styles.itemSubtitle}>correo@ejemplo.com</Text>
            </View>
          </View>
        </View>

        {/* Sección: Notificaciones */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notificaciones</Text>

          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Push</Text>
              <Text style={styles.itemSubtitle}>
                Recibe avisos en tu teléfono sobre movimientos importantes.
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              thumbColor={pushEnabled ? COLORS.primary : '#f4f4f4'}
              trackColor={{ false: '#d4d4d4', true: '#c7d2fe' }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>Correo electrónico</Text>
              <Text style={styles.itemSubtitle}>
                Resúmenes de gastos y recordatorios de pagos.
              </Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              thumbColor={emailEnabled ? COLORS.primary : '#f4f4f4'}
              trackColor={{ false: '#d4d4d4', true: '#c7d2fe' }}
            />
          </View>
        </View>

        {/* Sección: Seguridad */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Seguridad</Text>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.itemTitle}>Bloqueo con PIN/biometría</Text>
              <Text style={styles.itemSubtitle}>
                Recomendado para proteger tu información.
              </Text>
            </View>
            <Text style={styles.linkText}>Configurar</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  itemSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
    maxWidth: 220,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
