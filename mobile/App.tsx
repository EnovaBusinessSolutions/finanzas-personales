// App.tsx
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Dashboard from './src/screens/Dashboard';
import SettingsScreen from './src/screens/Settings';
import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import AppLoadingScreen from './src/screens/AppLoadingScreen';

import BottomMenu, { BottomTabKey } from './src/components/BottomMenu';
import { COLORS } from './src/theme/colors';
import { LanguageProvider } from './src/context/LanguageContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<BottomTabKey>('home');

  // 👉 flujo de arranque
  const [isSplashDone, setIsSplashDone] = useState(false);        // Pantalla E-nova
  const [isAppLoadingDone, setIsAppLoadingDone] = useState(false); // Logo + barra 0–100%
  const [isAuthenticated, setIsAuthenticated] = useState(false);   // Login/registro

  // Splash negro sólo mientras se muestra la pantalla de E-nova
  const isSplashVisible = !isSplashDone;

  const renderMainContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'settings':
        return <SettingsScreen />;
      case 'reports':
        // por ahora usamos el dashboard como placeholder
        return <Dashboard />;
      case 'goals':
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <LanguageProvider>
      <SafeAreaView
        style={{
          flex: 1,
          // 🔹 Negro absoluto mientras se muestra el splash de E-nova
          backgroundColor: isSplashVisible ? '#000000' : COLORS.background,
        }}
      >
        {/* 🔹 Barra de estado: texto claro sobre negro en el splash,
            texto oscuro sobre fondo claro en el resto de la app */}
        <StatusBar
          style={isSplashVisible ? 'light' : 'dark'}
          backgroundColor={isSplashVisible ? '#000000' : COLORS.background}
        />

        {/* 1) Splash con logo E-nova */}
        {!isSplashDone && (
          <SplashScreen onFinish={() => setIsSplashDone(true)} />
        )}

        {/* 2) Pantalla de carga de la app (logo Happy Life + barra 0–100%) */}
        {isSplashDone && !isAppLoadingDone && (
          <AppLoadingScreen onFinish={() => setIsAppLoadingDone(true)} />
        )}

        {/* 3) Pantalla de auth (login/registro) */}
        {isSplashDone && isAppLoadingDone && !isAuthenticated && (
          <AuthScreen onAuthSuccess={() => setIsAuthenticated(true)} />
        )}

        {/* 4) App principal con bottom nav */}
        {isSplashDone && isAppLoadingDone && isAuthenticated && (
          <>
            <View style={{ flex: 1 }}>{renderMainContent()}</View>

            <BottomMenu
              activeTab={activeTab}
              onTabChange={setActiveTab}
              colors={COLORS}
            />
          </>
        )}
      </SafeAreaView>
    </LanguageProvider>
  );
}
