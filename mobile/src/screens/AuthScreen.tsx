// mobile/src/screens/AuthScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../theme/colors';

type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Register: undefined;
  LoginEmail: undefined;
  Dashboard: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

const AuthScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleCreateAccount = () => {
    // Ir a pantalla de registro
    navigation.navigate('Register');
  };

  const handleLogin = () => {
    // Ir a pantalla de login por correo (tipo NU)
    navigation.navigate('LoginEmail');
  };

  // Año actual para los créditos
  const currentYear = new Date().getFullYear();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Bloque central: copy + botones */}
        <View style={styles.content}>
          {/* HERO COPY */}
          <View style={styles.heroBlock}>
            <Text style={styles.heroTitle}>
              La educación financiera{'\n'}es la clave del éxito.
            </Text>
            <Text style={styles.heroSubtitle}>
              Aprende a administrar tu dinero, metas y alertas desde un solo
              lugar, sin complicarte.
            </Text>
          </View>

          {/* BOTONES (más abajo en el eje Y) */}
          <View style={styles.actionsBlock}>
            {/* 🔹 Botón azul principal: Iniciar sesión */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLogin}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            {/* 🔹 Enlace secundario: registro */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleCreateAccount}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>
                Continuar o empezar registro
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER CRÉDITOS */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            HappyLife © {currentYear}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  heroBlock: {
    marginTop: 48,
    marginRight: 16,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
  },

  // 🔹 Botones un poco más abajo
  actionsBlock: {
    marginTop: 80, // antes 56 -> los baja más en el eje Y
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  primaryButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },

  footer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.muted,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default AuthScreen;
