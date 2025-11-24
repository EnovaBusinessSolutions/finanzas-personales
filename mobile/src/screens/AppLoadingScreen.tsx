// mobile/src/screens/AppLoadingScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  onFinish: () => void;
};

const AppLoadingScreen: React.FC<Props> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // ⏱ Duración total de la “carga” (en ms)
    const totalDuration = 3500; // 3.5 segundos aprox
    const intervalMs = 50;
    const step = 100 / (totalDuration / intervalMs);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);
          onFinish(); // Cuando llega a 100, pasamos a Auth
          return 100;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Logo de la app */}
      <Image
        source={require('../../assets/app-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Nombre de la app */}
      <Text style={styles.appName}>Happy Life</Text>
      <Text style={styles.subtitle}>Personal finance</Text>

      {/* Barra de progreso */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.round(progress)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // mismo fondo que la app
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 32,
  },
  progressWrapper: {
    width: '80%',
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#d4dde5',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.muted,
  },
});

export default AppLoadingScreen;
