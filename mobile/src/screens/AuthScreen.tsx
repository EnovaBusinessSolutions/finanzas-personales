// mobile/src/screens/AuthScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  onAuthSuccess: () => void;
};

const AuthScreen: React.FC<Props> = ({ onAuthSuccess }) => {
  const handleCreateAccount = () => {
    // 🔹 Más adelante aquí iría la navegación a la pantalla de registro
    onAuthSuccess(); // por ahora entra directo al app
  };

  const handleLogin = () => {
    // 🔹 Más adelante aquí iría la navegación a la pantalla de login
    onAuthSuccess(); // por ahora entra directo al app
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER: logo arriba izquierda */}
        <View style={styles.headerRow}>
          <View style={styles.logoRow}>
            <Image
              source={require('../../assets/app-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandText}>E-nova Finance</Text>
          </View>

          {/* Si luego quieres un selector de país como NU, lo ponemos aquí */}
          {/* <TouchableOpacity style={styles.countryPill}>
            <Text style={styles.countryText}>México ▾</Text>
          </TouchableOpacity> */}
        </View>

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

        {/* CTA PRINCIPAL */}
        <View style={styles.actionsBlock}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCreateAccount}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryButtonText}>
              Continuar o empezar registro
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER LEGAL */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Al continuar, aceptas nuestros{' '}
            <Text style={styles.footerLink}>Términos</Text> y{' '}
            <Text style={styles.footerLink}>Aviso de privacidad</Text>.
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
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  brandText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: COLORS.muted,
  },
  // countryPill: {
  //   paddingHorizontal: 14,
  //   paddingVertical: 8,
  //   borderRadius: 999,
  //   backgroundColor: 'rgba(255,255,255,0.28)',
  // },
  // countryText: {
  //   fontSize: 13,
  //   color: COLORS.card,
  //   fontWeight: '500',
  // },

  heroBlock: {
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
  },

  actionsBlock: {
    marginTop: 12,
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
    marginTop: 'auto',
    marginBottom: 24,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.muted,
    textAlign: 'center',
  },
  footerLink: {
    color: COLORS.text,
    fontWeight: '600',
  },
});

export default AuthScreen;
