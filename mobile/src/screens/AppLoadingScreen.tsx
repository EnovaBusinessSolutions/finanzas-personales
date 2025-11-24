// mobile/src/screens/AppLoadingScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  onFinish: () => void;
};

const { width } = Dimensions.get('window');
const LOGO_SIZE = width * 0.55; // 55% del ancho de pantalla

const AppLoadingScreen: React.FC<Props> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [showBar, setShowBar] = useState(false);

  // Animaciones del logo
  const logoOpacity = useRef(new Animated.Value(0)).current;   // empieza transparente
  const logoScale = useRef(new Animated.Value(0.7)).current;   // empieza al 70%

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    Animated.sequence([
      // pequeña pausa antes de empezar
      Animated.delay(250),

      // fade-in + zoom muy suave y más largo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 2200, // ~2.2s de aparición
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

      // dejamos el logo quieto un momento antes de mostrar la barra
      Animated.delay(500),
    ]).start(() => {
      setShowBar(true);

      // Lógica de la barra de progreso
      let value = 0;
      interval = setInterval(() => {
        value += 4;
        if (value >= 100) {
          value = 100;
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
          // pequeña pausa al llegar al 100% antes de continuar
          setTimeout(onFinish, 400);
        }
        setProgress(value);
      }, 120);
    });

    // cleanup por si la pantalla se desmonta antes
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [logoOpacity, logoScale, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/app-logo.png')}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />

      {showBar && (
        <View style={styles.loadingWrapper}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      )}
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
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    marginBottom: 48,
  },
  loadingWrapper: {
    width: '76%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 12,
    borderRadius: 999,
    backgroundColor: '#dde5f0',
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.primary, // azul principal de la app
  },
  progressText: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: '500',
  },
});

export default AppLoadingScreen;
