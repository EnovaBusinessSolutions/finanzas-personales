// mobile/src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  onFinish: () => void;
};

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    // ⏱ Tiempo que se muestra el splash antes de ir a Auth
    const timeout = setTimeout(onFinish, 1800);
    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Logo cerdito */}
      <Image
        source={require('../../assets/app-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* from E-NOVA (más grande) */}
      <View style={styles.footer}>
        <Text style={styles.fromText}>from</Text>
        <Text style={styles.brandText}>E-NOVA</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 160,   // el cerdito ya te gusta así, lo dejamos en este rango
    height: 160,
  },
  footer: {
    position: 'absolute',
    bottom: 64, // un poco arriba del borde inferior
    alignItems: 'center',
  },
  fromText: {
    fontSize: 18,          // ⬅️ más grande, similar a “from” de WhatsApp
    color: COLORS.muted,
    marginBottom: 4,
  },
  brandText: {
    fontSize: 20,          // ⬅️ nombre más grande
    letterSpacing: 2,      // look más de “marca”
    color: COLORS.primary, // azul de tu app
    fontWeight: '600',
  },
});

export default SplashScreen;
