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
  const logoOpacity = useRef(new Animated.Value(0)).current; // empieza transparente
  const logoScale = useRef(new Animated.Value(0.85)).current; // empieza un poco pequeño

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let barTimeout: ReturnType<typeof setTimeout> | null = null;

    // 1) Animación del logo (se dispara en cuanto se monta la pantalla)
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1300, // aparición más progresiva
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // 2) Mostramos la barra un poquito después,
    //    cuando el logo ya es claramente visible
    barTimeout = setTimeout(() => {
      setShowBar(true);

      let value = 0;
      interval = setInterval(() => {
        value += 4;
        if (value >= 100) {
          value = 100;
          setProgress(value);

          if (interval) {
            clearInterval(interval);
            interval = null;
          }

          // pequeña pausa al llegar a 100% antes de pasar a Auth
          setTimeout(onFinish, 400);
        } else {
          setProgress(value);
        }
      }, 120);
    }, 800); // espera antes de mostrar la barra

    // Limpieza si la pantalla se desmonta antes
    return () => {
      if (interval) clearInterval(interval);
      if (barTimeout) clearTimeout(barTimeout);
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
