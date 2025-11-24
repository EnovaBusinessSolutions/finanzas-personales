// mobile/src/screens/Settings.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../theme/colors';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  // 👉 Estados visuales para personalización
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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

        {/* ⭐ Nueva sección: Personalización */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personalización</Text>

          {/* Idioma */}
          <View style={{ marginBottom: 14 }}>
            <Text style={styles.itemTitle}>Idioma de la app</Text>
            <Text style={styles.itemSubtitle}>
              Elige en qué idioma prefieres ver la información.
            </Text>

            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  language === 'es' && styles.chipActive,
                ]}
                onPress={() => setLanguage('es')}
              >
                <Text
                  style={[
                    styles.chipText,
                    language === 'es' && styles.chipTextActive,
                  ]}
                >
                  Español
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.chip,
                  language === 'en' && styles.chipActive,
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text
                  style={[
                    styles.chipText,
                    language === 'en' && styles.chipTextActive,
                  ]}
                >
                  Inglés
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Tema */}
          <View>
            <Text style={styles.itemTitle}>Tema</Text>
            <Text style={styles.itemSubtitle}>
              Cambia entre tema claro u oscuro de la app.
            </Text>

            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  theme === 'light' && styles.chipActive,
                ]}
                onPress={() => setTheme('light')}
              >
                <Text
                  style={[
                    styles.chipText,
                    theme === 'light' && styles.chipTextActive,
                  ]}
                >
                  Claro
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.chip,
                  theme === 'dark' && styles.chipActive,
                ]}
                onPress={() => setTheme('dark')}
              >
                <Text
                  style={[
                    styles.chipText,
                    theme === 'dark' && styles.chipTextActive,
                  ]}
                >
                  Oscuro
                </Text>
              </TouchableOpacity>
            </View>
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
    maxWidth: 260,
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

  // Chips de personalización
  chipRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    backgroundColor: '#f5f7fa',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
