// App.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Dashboard from './src/screens/Dashboard';
import SettingsScreen from './src/screens/Settings';
import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginEmailScreen from './src/screens/LoginEmailScreen';
import LoginPasswordScreen from './src/screens/LoginPasswordScreen';

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
  LoginPassword: { email: string };
  Register: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 🔹 Layout principal (Dashboard + BottomMenu)
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
  // 👉 control de Splash + lectura de sesión
  const [isSplashDone, setIsSplashDone] = useState(false); // fin de animación splash
  const [bootReady, setBootReady] = useState(false);       // ya leímos AsyncStorage
  const [hasSession, setHasSession] = useState(false);     // hay token sí/no

  // Splash negro sólo mientras se muestra la pantalla de splash
  const isSplashVisible = !isSplashDone;

  // Al arrancar la app, leemos si hay token guardado
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        setHasSession(!!storedToken);
      } catch (err) {
        console.log('Error leyendo authToken:', err);
        setHasSession(false);
      } finally {
        setBootReady(true);
      }
    };

    bootstrap();
  }, []);

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
            {/* 1) Mientras siga el Splash o aún no sepamos si hay sesión,
                  solo mostramos la pantalla Splash */}
            {!isSplashDone || !bootReady ? (
              <Stack.Screen name="Splash">
                {() => (
                  <SplashScreen onFinish={() => setIsSplashDone(true)} />
                )}
              </Stack.Screen>
            ) : hasSession ? (
              // 2) Ya terminó el Splash y SÍ hay token guardado:
              //    arrancamos directamente en el Dashboard.
              <>
                <Stack.Screen
                  name="Dashboard"
                  component={DashboardWrapper}
                />

                {/* Dejamos las demás pantallas por si luego quieres navegar
                    manualmente o hacer logout/login */}
                <Stack.Screen name="Auth" component={AuthScreen} />
                <Stack.Screen name="LoginEmail" component={LoginEmailScreen} />
                <Stack.Screen
                  name="LoginPassword"
                  component={LoginPasswordScreen}
                />
                <Stack.Screen name="Register">
                  {({ navigation }) => (
                    <RegisterScreen
                      onRegisterSuccess={() =>
                        navigation.replace('Dashboard')
                      }
                      onBackToLogin={() => navigation.goBack()}
                    />
                  )}
                </Stack.Screen>
              </>
            ) : (
              // 3) Ya terminó el Splash y NO hay token:
              //    flujo normal de Auth -> Login -> Dashboard.
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
                      onRegisterSuccess={() =>
                        navigation.replace('Dashboard')
                      }
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
