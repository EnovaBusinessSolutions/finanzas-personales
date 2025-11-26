// mobile/src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  onFinish: () => void;
};

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2200); // ~2.2s como WhatsApp
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Logo principal al centro */}
      <Image
        source={require('../../assets/app-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* "from E-nova" tipo WhatsApp/Meta */}
      <View style={styles.footer}>
        <Text style={styles.fromText}>from</Text>
        <Text style={styles.brandText}>E-nova</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // 🔹 mismo fondo suave que el resto de la app, ya NO negro
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 160,
  },
  footer: {
    position: 'absolute',
    bottom: 48, // un poco más arriba del borde
    alignItems: 'center',
  },
  fromText: {
    fontSize: 16,          // más grande
    color: COLORS.muted,   // gris suave
    marginBottom: 4,
  },
  brandText: {
    fontSize: 20,          // similar al "Meta" de la captura
    fontWeight: '600',
    letterSpacing: 2,
    color: COLORS.text,    // mismo azul/negro de tus títulos
    textTransform: 'uppercase',
  },
});

export default SplashScreen;
