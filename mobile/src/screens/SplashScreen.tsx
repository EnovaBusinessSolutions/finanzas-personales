// mobile/src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  onFinish: () => void;
};

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  // Sólo controlamos cuánto tiempo se muestra la pantalla,
  // pero los logos se pintan INMEDIATAMENTE.
  useEffect(() => {
    const timer = setTimeout(onFinish, 2200); // ~2.2s de splash
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Logo principal de la app (cerdito) */}
      <View style={styles.centerContent}>
        <Image
          source={require('../../assets/app-logo.png')}
          style={styles.appLogo}
          resizeMode="contain"
        />
      </View>

      {/* Footer "from E-nova" con logo real */}
      <View style={styles.footer}>
        <Text style={styles.footerFrom}>from</Text>
        <Image
          source={require('../../assets/enova-logo.png')}
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
    backgroundColor: COLORS.background, // mismo color que la app
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appLogo: {
    width: 220,
    height: 220,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  footerFrom: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 4,
  },
  enovaLogo: {
    height: 26,
    width: 150, // tamaño similar a "from Meta"
  },
});

export default SplashScreen;
