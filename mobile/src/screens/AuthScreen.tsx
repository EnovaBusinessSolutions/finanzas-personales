// mobile/src/screens/AuthScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  onAuthSuccess: () => void;
};

const AuthScreen: React.FC<Props> = ({ onAuthSuccess }) => {
  const handleCreateAccount = () => {
    // Más adelante aquí irán las pantallas reales de registro
    onAuthSuccess();
  };

  const handleLogin = () => {
    // Más adelante aquí irán las pantallas reales de login
    onAuthSuccess();
  };

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

          {/* BOTONES (un poco más arriba en Y) */}
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
    paddingTop: 24,
    paddingBottom: 24,
  },

  // Ahora controlamos el espacio manualmente
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  heroBlock: {
    marginTop: 48,   // separa bien del notch
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

  // Botones más centrados verticalmente
  actionsBlock: {
    marginTop: 56,   // 🔹 sube/baja el bloque de botones
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
