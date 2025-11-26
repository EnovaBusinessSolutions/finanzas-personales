// mobile/src/screens/AuthScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  onAuthSuccess: () => void;
};

type Mode = 'login' | 'register';

const AuthScreen: React.FC<Props> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<Mode>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = () => {
    // TODO: aquí después conectaremos con tu backend real.
    // Por ahora solo simulamos que todo salió bien.
    onAuthSuccess();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* HERO tipo NU pero con tu branding */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>E-NOVA FINANCE</Text>
          <Text style={styles.heroTitle}>
            Las finanzas claras deberían ser lo normal.
          </Text>
          <Text style={styles.heroSubtitle}>
            Administra tus cuentas, alertas y metas desde un solo lugar.
          </Text>
        </View>

        {/* Card principal de auth */}
        <View style={styles.card}>
          {/* Segment control modo NU: Crear cuenta / Iniciar sesión */}
          <View style={styles.segmentContainer}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                !isLogin && styles.segmentButtonActive,
              ]}
              onPress={() => setMode('register')}
            >
              <Text
                style={[
                  styles.segmentText,
                  !isLogin && styles.segmentTextActive,
                ]}
              >
                Crear cuenta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentButton,
                isLogin && styles.segmentButtonActive,
              ]}
              onPress={() => setMode('login')}
            >
              <Text
                style={[
                  styles.segmentText,
                  isLogin && styles.segmentTextActive,
                ]}
              >
                Iniciar sesión
              </Text>
            </TouchableOpacity>
          </View>

          {/* Título del formulario */}
          <Text style={styles.formTitle}>
            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta financiera'}
          </Text>
          <Text style={styles.formSubtitle}>
            {isLogin
              ? 'Ingresa con tu correo y contraseña.'
              : 'Toma menos de un minuto empezar.'}
          </Text>

          {/* Campos */}
          {!isLogin && (
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput
                placeholder="Tu nombre"
                placeholderTextColor="#9ca3af"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {!isLogin && (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <TextInput
                placeholder="Repite tu contraseña"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          )}

          {/* Botón principal tipo NU */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
            <Text style={styles.primaryButtonText}>
              {isLogin ? 'Entrar' : 'Continuar'}
            </Text>
          </TouchableOpacity>

          {/* Link secundario para cambiar de modo */}
          <TouchableOpacity
            style={styles.secondaryLink}
            onPress={() => setMode(isLogin ? 'register' : 'login')}
          >
            <Text style={styles.secondaryLinkText}>
              {isLogin
                ? '¿Aún no tienes cuenta? Crear cuenta'
                : '¿Ya tienes cuenta? Inicia sesión'}
            </Text>
          </TouchableOpacity>

          {/* Aviso legal */}
          {!isLogin && (
            <Text style={styles.legalText}>
              Al continuar aceptas nuestros Términos y el Aviso de privacidad.
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  hero: {
    marginBottom: 28,
  },
  heroTag: {
    fontSize: 13,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: COLORS.muted,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 20,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5edf5',
    borderRadius: 999,
    padding: 4,
    marginBottom: 18,
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
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.muted,
  },
  segmentTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },

  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  input: {
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: '#f4f6fb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 14,
    color: COLORS.text,
  },

  primaryButton: {
    marginTop: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  secondaryLink: {
    marginTop: 14,
    alignItems: 'center',
  },
  secondaryLinkText: {
    fontSize: 13,
    color: COLORS.muted,
  },

  legalText: {
    marginTop: 10,
    fontSize: 11,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default AuthScreen;
