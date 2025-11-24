// mobile/src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

type SplashScreenProps = {
  onFinish?: () => void; // opcional, por si luego quieres controlar el flujo desde App.tsx
};

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Pequeño delay para mostrar el splash
  useEffect(() => {
    if (!onFinish) return;

    const timer = setTimeout(() => {
      onFinish();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/enova-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // fondo negro tipo E-nova
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 60,
  },
});

export default SplashScreen;
