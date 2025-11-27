// App.tsx 
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Dashboard from './src/screens/Dashboard';
import SettingsScreen from './src/screens/Settings';
import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import RegisterScreen from './src/screens/RegisterScreen'; // 🔹 registro
import LoginEmailScreen from './src/screens/LoginEmailScreen'; // 🔹 pantalla login (correo)
import LoginPasswordScreen from './src/screens/LoginPasswordScreen'; // 🔹 pantalla contraseña

import BottomMenu, { BottomTabKey } from './src/components/BottomMenu';
import { COLORS } from './src/theme/colors';
import { LanguageProvider } from './src/context/LanguageContext';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 🔹 Rutas de navegación principales
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  LoginEmail: undefined;
  LoginPassword: { email: string };   // 👈 aquí recibe el correo
  Register: undefined;
  Dashboard: undefined;               // aquí vive el layout con BottomMenu
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 🔹 Layout principal (Dashboard + BottomMenu) usando tu estado de tabs
const DashboardWrapper: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BottomTabKey>('home');

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
    <>
      <View style={{ flex: 1 }}>{renderMainContent()}</View>
      <BottomMenu
        activeTab={activeTab}
        onTabChange={setActiveTab}
        colors={COLORS}
      />
    </>
  );
};

export default function App() {
  // 👉 flujo simple: Splash único -> Auth/Register/Login -> Dashboard
  const [isSplashDone, setIsSplashDone] = useState(false); // Pantalla tipo WhatsApp

  // Splash negro sólo mientras se muestra la pantalla de splash
  const isSplashVisible = !isSplashDone;

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

        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* 1) Mientras no termine el splash, solo existe esta pantalla */}
            {!isSplashDone ? (
              <Stack.Screen name="Splash">
                {() => (
                  <SplashScreen onFinish={() => setIsSplashDone(true)} />
                )}
              </Stack.Screen>
            ) : (
              <>
                {/* 2A) Pantalla de auth (inicio) */}
                <Stack.Screen name="Auth" component={AuthScreen} />

                {/* 2B) Pantalla de login por correo tipo NU */}
                <Stack.Screen
                  name="LoginEmail"
                  component={LoginEmailScreen}
                />

                {/* 2C) Pantalla de contraseña tipo NU */}
                <Stack.Screen
                  name="LoginPassword"
                  component={LoginPasswordScreen}
                />

                {/* 2D) Pantalla de registro tipo NU */}
                <Stack.Screen name="Register">
                  {({ navigation }) => (
                    <RegisterScreen
                      // después de registrar, entra directo al dashboard
                      onRegisterSuccess={() =>
                        navigation.replace('Dashboard')
                      }
                      // volver a Auth
                      onBackToLogin={() => navigation.goBack()}
                    />
                  )}
                </Stack.Screen>

                {/* 3) App principal con bottom nav */}
                <Stack.Screen
                  name="Dashboard"
                  component={DashboardWrapper}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </LanguageProvider>
  );
}
