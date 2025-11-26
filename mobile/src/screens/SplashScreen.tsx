// mobile/src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  onFinish: () => void;
};

// Medidas aproximadas tipo WhatsApp
const { width, height } = Dimensions.get('window');
const ICON_SIZE = width * 0.30; // icono ~30% del ancho

// 🔹 Logo E-nova grande, estilo “Meta”
const ENOVA_WIDTH = width * 0.80;         // antes 0.42 → más ancho
const ENOVA_HEIGHT = ENOVA_WIDTH * 0.24;  // proporción horizontal

// Cargamos las imágenes una sola vez
const appLogo = require('../../assets/app-logo.png');     // cerdito
const enovaLogo = require('../../assets/enova-logo.png'); // logo E-nova

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2200); // tiempo en pantalla
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Icono de la app (cerdito) centrado */}
      <View style={styles.centerContent}>
        <Image
          source={appLogo}
          style={styles.appIcon}
          resizeMode="contain"
        />
      </View>

      {/* “from E-NOVA” abajo, estilo WhatsApp */}
      <View style={styles.footer}>
        <Text style={styles.fromLabel}>from</Text>
        <Image
          source={enovaLogo}
          style={styles.enovaLogo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // mismo fondo que la app
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  footer: {
    alignItems: 'center',
    marginBottom: height * 0.09, // posición parecida a WhatsApp
  },
  fromLabel: {
    fontSize: 18,          // texto “from” grande
    color: COLORS.muted,
    marginBottom: 5,       // 🔹 más pegado al logo
    fontWeight: '500',
  },
  enovaLogo: {
    width: ENOVA_WIDTH,
    height: ENOVA_HEIGHT,
  },
});

export default SplashScreen;
