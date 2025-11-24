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
  const logoOpacity = useRef(new Animated.Value(0)).current; // arranca transparente
  const logoScale = useRef(new Animated.Value(0.9)).current; // arranca un poco pequeño

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let finished = false;

    // Animación del logo (similar a la de E-nova, pero un poco más larga)
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1200, // 1.2s: se nota la aparición pero no es eterna
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
      // pequeña pausa con el logo ya visible
      Animated.delay(400),
    ]).start(() => {
      if (finished) return;
      setShowBar(true);

      // Lógica de la barra de progreso
      interval = setInterval(() => {
        setProgress((prev) => {
          let next = prev + 4;
          if (next >= 100) {
            next = 100;
            if (interval) {
              clearInterval(interval);
              interval = null;
            }
            setTimeout(() => {
              if (!finished) {
                finished = true;
                onFinish();
              }
            }, 400);
          }
          return next;
        });
      }, 120);
    });

    // Cleanup por si la pantalla se desmonta antes
    return () => {
      finished = true;
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
