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
    // Simulamos carga del 0 al 100
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 500); // pequeña pausa al llegar al 100
          return 100;
        }
        return prev + 4; // velocidad de llenado
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* LOGO grande */}
      <Image
        source={require('../../assets/app-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Barra de progreso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
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
    width: 260,   // 🔹 Logo más grande
    height: 260,  //  (ajusta si lo quieres aún más)
    marginBottom: 48,
  },
  progressContainer: {
    width: '78%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 14, // 🔹 Barra más alta
    borderRadius: 999,
    backgroundColor: '#dbe4f0', // tono claro acorde al tema
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.primary, // azul principal de la app
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.muted,
  },
});

export default AppLoadingScreen;
