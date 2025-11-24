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

  // Estados visuales para personalización
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ajustes</Text>
          <Text style={styles.headerSubtitle}>
            Personaliza cómo quieres usar tu app financiera.
          </Text>
        </View>

        {/* Perfil */}
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

        {/* Notificaciones */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notificaciones</Text>

          <View style={styles.rowBetween}>
            <View style={styles.textBlock}>
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
            <View style={styles.textBlock}>
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

        {/* Seguridad */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Seguridad</Text>

          <View style={styles.rowBetween}>
            <View style={styles.textBlock}>
              <Text style={styles.itemTitle}>Bloqueo con PIN/biometría</Text>
              <Text style={styles.itemSubtitle}>
                Recomendado para proteger tu información.
              </Text>
            </View>
            <Text style={styles.linkText}>Configurar</Text>
          </View>
        </View>

        {/* Personalización */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personalización</Text>

          {/* Idioma */}
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.itemTitle}>Idioma de la app</Text>
            <Text style={styles.itemSubtitle}>
              Elige en qué idioma prefieres ver la información.
            </Text>

            <View style={styles.segmentRow}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  language === 'es' && styles.segmentButtonActive,
                ]}
                onPress={() => setLanguage('es')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    language === 'es' && styles.segmentTextActive,
                  ]}
                >
                  Español
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  language === 'en' && styles.segmentButtonActive,
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    language === 'en' && styles.segmentTextActive,
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

            <View style={styles.segmentRow}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  theme === 'light' && styles.segmentButtonActive,
                ]}
                onPress={() => setTheme('light')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    theme === 'light' && styles.segmentTextActive,
                  ]}
                >
                  Claro
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  theme === 'dark' && styles.segmentButtonActive,
                ]}
                onPress={() => setTheme('dark')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    theme === 'dark' && styles.segmentTextActive,
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
    paddingBottom: 24,
  },
  header: {
    marginBottom: 18,
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
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    paddingRight: 16,
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
    lineHeight: 16,
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

  // Segment buttons (idioma / tema)
  segmentRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  segmentText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
