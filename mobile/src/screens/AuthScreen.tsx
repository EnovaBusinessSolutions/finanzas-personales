// mobile/src/screens/AuthScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

type AuthScreenProps = {
  onAuthSuccess: () => void;
};

const copy = {
  es: {
    title: 'Bienvenido a tu app financiera',
    subtitle: 'Administra tus cuentas, alertas y metas desde un solo lugar.',
    loginTab: 'Iniciar sesión',
    registerTab: 'Crear cuenta',
    name: 'Nombre',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    loginButton: 'Entrar',
    registerButton: 'Crear cuenta',
    noAccount: '¿Aún no tienes cuenta? Regístrate',
    haveAccount: '¿Ya tienes cuenta? Inicia sesión',
  },
  en: {
    title: 'Welcome to your finance app',
    subtitle: 'Manage accounts, alerts and goals from one place.',
    loginTab: 'Log in',
    registerTab: 'Sign up',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    loginButton: 'Log in',
    registerButton: 'Create account',
    noAccount: "Don't have an account yet? Sign up",
    haveAccount: 'Already have an account? Log in',
  },
};

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const { language } = useLanguage();
  const t = copy[language];

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePrimaryAction = () => {
    // 👇 Aquí después conectaremos con tu backend / Belvo / etc.
    onAuthSuccess();
  };

  const switchToLogin = () => {
    setMode('login');
  };

  const switchToRegister = () => {
    setMode('register');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.appName}>E-nova Finance</Text>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>

        {/* Tabs login / registro */}
        <View style={styles.segmentRow}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              mode === 'login' && styles.segmentButtonActive,
            ]}
            onPress={switchToLogin}
          >
            <Text
              style={[
                styles.segmentText,
                mode === 'login' && styles.segmentTextActive,
              ]}
            >
              {t.loginTab}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              mode === 'register' && styles.segmentButtonActive,
            ]}
            onPress={switchToRegister}
          >
            <Text
              style={[
                styles.segmentText,
                mode === 'register' && styles.segmentTextActive,
              ]}
            >
              {t.registerTab}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {mode === 'register' && (
            <>
              <Text style={styles.inputLabel}>{t.name}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.name}
                placeholderTextColor={COLORS.muted}
                value={name}
                onChangeText={setName}
              />
            </>
          )}

          <Text style={styles.inputLabel}>{t.email}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.email}
            placeholderTextColor={COLORS.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.inputLabel}>{t.password}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.password}
            placeholderTextColor={COLORS.muted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {mode === 'register' && (
            <>
              <Text style={styles.inputLabel}>{t.confirmPassword}</Text>
              <TextInput
                style={styles.input}
                placeholder={t.confirmPassword}
                placeholderTextColor={COLORS.muted}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </>
          )}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handlePrimaryAction}
          >
            <Text style={styles.primaryButtonText}>
              {mode === 'login' ? t.loginButton : t.registerButton}
            </Text>
          </TouchableOpacity>

          {mode === 'login' ? (
            <TouchableOpacity style={styles.switchMode} onPress={switchToRegister}>
              <Text style={styles.switchModeText}>{t.noAccount}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.switchMode} onPress={switchToLogin}>
              <Text style={styles.switchModeText}>{t.haveAccount}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
  },
  segmentRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#e5edf0',
    borderRadius: 999,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: COLORS.card,
  },
  segmentText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 6,
    marginBottom: 4,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 6,
    color: COLORS.text,
    backgroundColor: '#f9fafb',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.card,
    fontWeight: '700',
    fontSize: 15,
  },
  switchMode: {
    marginTop: 12,
    alignItems: 'center',
  },
  switchModeText: {
    fontSize: 12,
    color: COLORS.muted,
  },
});

export default AuthScreen;
