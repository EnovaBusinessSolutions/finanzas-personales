// mobile/src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { COLORS } from '../theme/colors';

type SplashScreenProps = {
  onFinish: () => void;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Valores animados
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // 1) Animación de entrada del logo
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2) Pequeña pausa y luego pasamos a Auth
      setTimeout(onFinish, 700);
    });
  }, [opacity, scale, onFinish]);

  return (
    <View style={styles.container}>
      {/* Opcional: status bar oscura mientras carga */}
      <StatusBar barStyle="light-content" />

      <Animated.Image
        source={require('../../assets/enova-logo.png')}
        style={[
          styles.logo,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // fondo negro para tu branding
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '70%',   // se ve bien en la mayoría de móviles
    height: '20%',  // controlamos la altura para que no ocupe todo
  },
});

export default SplashScreen;
