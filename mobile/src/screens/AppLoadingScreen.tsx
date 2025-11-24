// mobile/src/screens/AppLoadingScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
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
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
  // Arranque más suave y largo del logo
  Animated.sequence([
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1800,      // ⬅️ antes 900ms, ahora 1.8s
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,         // ⬅️ un pelín más suave
        tension: 40,         // ⬅️ menos “rebotón”
        useNativeDriver: true,
      }),
    ]),
    Animated.delay(400),      // ⬅️ pequeña pausa con el logo ya visible
  ]).start(() => {
    setShowBar(true);
    // aquí sigue tu lógica de la barra de progreso
    let value = 0;
    const interval = setInterval(() => {
      value += 4;
      if (value >= 100) {
        value = 100;
        clearInterval(interval);
        setTimeout(onFinish, 400);
      }
      setProgress(value);
    }, 120);
  });
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
