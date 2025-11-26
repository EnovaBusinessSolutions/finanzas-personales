// App.tsx 
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Dashboard from './src/screens/Dashboard';
import SettingsScreen from './src/screens/Settings';
import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import RegisterScreen from './src/screens/RegisterScreen'; // 🔹 nueva importación

import BottomMenu, { BottomTabKey } from './src/components/BottomMenu';
import { COLORS } from './src/theme/colors';
import { LanguageProvider } from './src/context/LanguageContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<BottomTabKey>('home');

  // 👉 flujo simple: Splash único -> Auth/Register -> App
  const [isSplashDone, setIsSplashDone] = useState(false);       // Pantalla tipo WhatsApp
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Login/registro
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login'); // 🔹 estado para elegir pantalla

  // Splash negro sólo mientras se muestra la pantalla de splash
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
          // 🔹 Negro absoluto mientras se muestra el splash
          backgroundColor: isSplashVisible ? '#000000' : COLORS.background,
        }}
      >
        {/* 🔹 Barra de estado: texto claro sobre negro en el splash,
            texto oscuro sobre fondo claro en el resto de la app */}
        <StatusBar
          style={isSplashVisible ? 'light' : 'dark'}
          backgroundColor={isSplashVisible ? '#000000' : COLORS.background}
        />

        {/* 1) Splash único con logo cerdito + “from E-nova” */}
        {!isSplashDone && (
          <SplashScreen onFinish={() => setIsSplashDone(true)} />
        )}

        {/* 2A) Pantalla de auth (inicio de sesión) */}
        {isSplashDone && !isAuthenticated && authMode === 'login' && (
          <AuthScreen
            onAuthSuccess={() => setIsAuthenticated(true)}
            onGoToRegister={() => setAuthMode('register')} // 🔹 ir a registro
          />
        )}

        {/* 2B) Pantalla de registro tipo NU */}
        {isSplashDone && !isAuthenticated && authMode === 'register' && (
          <RegisterScreen
            onRegisterSuccess={() => setIsAuthenticated(true)} // 🔹 después de registrar, entra directo
            onBackToLogin={() => setAuthMode('login')}        // 🔹 volver a la pantalla de login
          />
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
