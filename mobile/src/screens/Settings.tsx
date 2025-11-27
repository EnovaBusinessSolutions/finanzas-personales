// mobile/src/screens/Settings.tsx 
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS } from '../theme/colors';
import { useLanguage, Language } from '../context/LanguageContext';

// Textos en ES / EN
const STRINGS = {
  es: {
    settingsTitle: 'Ajustes',
    settingsSubtitle: 'Personaliza cómo quieres usar tu app financiera.',

    profileTitle: 'Perfil',
    nameLabel: 'Nombre',
    emailLabel: 'Correo',

    notificationsTitle: 'Notificaciones',
    pushTitle: 'Push',
    pushDesc:
      'Recibe avisos en tu teléfono sobre movimientos importantes.',
    emailTitle: 'Correo electrónico',
    emailDesc: 'Resúmenes de gastos y recordatorios de pagos.',

    securityTitle: 'Seguridad',
    securityLockTitle: 'Bloqueo con PIN/biometría',
    securityDesc: 'Recomendado para proteger tu información.',
    securityAction: 'Configurar',

    personalizationTitle: 'Personalización',
    languageTitle: 'Idioma de la app',
    languageDesc: 'Elige en qué idioma prefieres ver la información.',
    themeTitle: 'Tema',
    themeDesc: 'Cambia entre tema claro u oscuro de la app.',

    spanishLabel: 'Español',
    englishLabel: 'Inglés',
    lightLabel: 'Claro',
    darkLabel: 'Oscuro',

    langDialogTitle: 'Cambiar idioma',
    langDialogMessage:
      'Esta configuración hará que toda la app se muestre en el idioma seleccionado.',
    cancelLabel: 'Cancelar',
    continueLabel: 'Continuar',

    nameValue: 'Jose Manuel',
    emailValue: 'correo@ejemplo.com',

    // Cuenta / logout
    accountTitle: 'Cuenta',
    logoutButton: 'Cerrar sesión',
    logoutSubtitle: 'Salir de la app en este dispositivo.',
  },
  en: {
    settingsTitle: 'Settings',
    settingsSubtitle: 'Customize how you want to use your finance app.',

    profileTitle: 'Profile',
    nameLabel: 'Name',
    emailLabel: 'Email',

    notificationsTitle: 'Notifications',
    pushTitle: 'Push',
    pushDesc: 'Get alerts on your phone about important movements.',
    emailTitle: 'Email',
    emailDesc: 'Expense summaries and payment reminders.',

    securityTitle: 'Security',
    securityLockTitle: 'PIN / biometrics lock',
    securityDesc: 'Recommended to protect your information.',
    securityAction: 'Configure',

    personalizationTitle: 'Personalization',
    languageTitle: 'App language',
    languageDesc:
      'Choose which language you prefer to see the information in.',
    themeTitle: 'Theme',
    themeDesc: 'Switch between light and dark mode for the app.',

    spanishLabel: 'Spanish',
    englishLabel: 'English',
    lightLabel: 'Light',
    darkLabel: 'Dark',

    langDialogTitle: 'Change language',
    langDialogMessage:
      'This setting will change the language for the entire app.',
    cancelLabel: 'Cancel',
    continueLabel: 'Continue',

    nameValue: 'Jose Manuel',
    emailValue: 'email@example.com',

    accountTitle: 'Account',
    logoutButton: 'Sign out',
    logoutSubtitle: 'Sign out from this device.',
  },
};

// mismas rutas que en App.tsx
type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  LoginEmail: undefined;
  LoginPassword: { email: string };
  Register: undefined;
  Dashboard: undefined;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

export default function SettingsScreen() {
  const {
    language,
    setLanguage,
    hasSeenLanguageInfo,
    setHasSeenLanguageInfo,
  } = useLanguage();

  const navigation = useNavigation<NavigationProp>();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const t = STRINGS[language];

  const handleSelectLanguage = (lang: Language) => {
    if (lang === language) return;

    // Primera vez: mostrar popup explicativo
    if (!hasSeenLanguageInfo) {
      Alert.alert(
        t.langDialogTitle,
        t.langDialogMessage,
        [
          {
            text: t.cancelLabel,
            style: 'cancel',
          },
          {
            text: t.continueLabel,
            style: 'default',
            onPress: () => {
              setLanguage(lang);
              setHasSeenLanguageInfo(true);
            },
          },
        ],
        { cancelable: true },
      );
      return;
    }

    // Si ya vio el mensaje, solo cambiamos idioma
    setLanguage(lang);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'authUser']);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (err) {
      console.log('Error al cerrar sesión:', err);
      Alert.alert(
        'Error',
        'No pudimos cerrar sesión. Intenta de nuevo.',
      );
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.settingsTitle}</Text>
          <Text style={styles.headerSubtitle}>
            {t.settingsSubtitle}
          </Text>
        </View>

        {/* Perfil */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.profileTitle}</Text>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.itemTitle}>{t.nameLabel}</Text>
              <Text style={styles.itemSubtitle}>{t.nameValue}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.itemTitle}>{t.emailLabel}</Text>
              <Text style={styles.itemSubtitle}>{t.emailValue}</Text>
            </View>
          </View>
        </View>

        {/* Notificaciones */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.notificationsTitle}</Text>

          <View style={styles.rowBetween}>
            <View style={styles.textBlock}>
              <Text style={styles.itemTitle}>{t.pushTitle}</Text>
              <Text style={styles.itemSubtitle}>{t.pushDesc}</Text>
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
              <Text style={styles.itemTitle}>{t.emailTitle}</Text>
              <Text style={styles.itemSubtitle}>{t.emailDesc}</Text>
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
          <Text style={styles.cardTitle}>{t.securityTitle}</Text>

          <View style={styles.rowBetween}>
            <View style={styles.textBlock}>
              <Text style={styles.itemTitle}>{t.securityLockTitle}</Text>
              <Text style={styles.itemSubtitle}>{t.securityDesc}</Text>
            </View>
            <Text style={styles.linkText}>{t.securityAction}</Text>
          </View>
        </View>

        {/* Personalización */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t.personalizationTitle}
          </Text>

          {/* Idioma */}
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.itemTitle}>{t.languageTitle}</Text>
            <Text style={styles.itemSubtitle}>
              {t.languageDesc}
            </Text>

            <View style={styles.segmentRow}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  language === 'es' && styles.segmentButtonActive,
                ]}
                onPress={() => handleSelectLanguage('es')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    language === 'es' && styles.segmentTextActive,
                  ]}
                >
                  {t.spanishLabel}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  language === 'en' && styles.segmentButtonActive,
                ]}
                onPress={() => handleSelectLanguage('en')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    language === 'en' && styles.segmentTextActive,
                  ]}
                >
                  {t.englishLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Tema (visual por ahora) */}
          <View>
            <Text style={styles.itemTitle}>{t.themeTitle}</Text>
            <Text style={styles.itemSubtitle}>{t.themeDesc}</Text>

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
                  {t.lightLabel}
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
                  {t.darkLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Cuenta / Cerrar sesión */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.accountTitle}</Text>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Text style={styles.logoutText}>{t.logoutButton}</Text>
            <Text style={styles.logoutSubtext}>
              {t.logoutSubtitle}
            </Text>
          </TouchableOpacity>
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

  // 🔵 Estilos nuevos del botón de cerrar sesión (look NU / Adnova)
  logoutButton: {
    marginTop: 6,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: COLORS.primary, // mismo azul oscuro que los botones activos
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutSubtext: {
    marginTop: 2,
    fontSize: 12,
    color: '#E5E7EB', // gris clarito para contraste suave
  },
});
