// App.tsx
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Dashboard from './src/screens/Dashboard';
import SettingsScreen from './src/screens/Settings';
import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';

import BottomMenu, { BottomTabKey } from './src/components/BottomMenu';
import { COLORS } from './src/theme/colors';
import { LanguageProvider } from './src/context/LanguageContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<BottomTabKey>('home');

  // 👉 flujo de arranque
  const [isSplashDone, setIsSplashDone] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        style={{ flex: 1, backgroundColor: COLORS.background }}
      >
        <StatusBar style="light" />

        {/* 1) Splash con logo E-nova */}
        {!isSplashDone && (
          <SplashScreen onFinish={() => setIsSplashDone(true)} />
        )}

        {/* 2) Pantalla de auth (login/registro) */}
        {isSplashDone && !isAuthenticated && (
          <AuthScreen onAuthSuccess={() => setIsAuthenticated(true)} />
        )}

        {/* 3) App principal con bottom nav */}
        {isSplashDone && isAuthenticated && (
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
