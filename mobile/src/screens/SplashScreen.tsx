// mobile/src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

type Props = {
  onFinish: () => void;
};

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timeout = setTimeout(onFinish, 2200); // ⬅️ tiempo en pantalla ~2.2s
    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Logo principal de la app al centro */}
      <Image
        source={require('../../assets/app-logo.png')} // cerdito
        style={styles.mainLogo}
        resizeMode="contain"
      />

      {/* Footer "from E-nova" al fondo, tipo WhatsApp */}
      <View style={styles.footer}>
        <Text style={styles.fromText}>from</Text>
        <Image
          source={require('../../assets/enova-logo.png')} // logo E-nova en pequeño
          style={styles.brandLogo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainLogo: {
    width: 140,
    height: 140,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    width: '100%',
    alignItems: 'center',
  },
  fromText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  brandLogo: {
    width: 90,
    height: 24,
  },
});

export default SplashScreen;
