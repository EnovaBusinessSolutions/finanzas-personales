// App.tsx
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Dashboard from './src/screens/Dashboard';
import SettingsScreen from './src/screens/Settings';
import BottomMenu, {
  BottomTabKey,
} from './src/components/BottomMenu';
import { COLORS } from './src/theme/colors';
import { LanguageProvider } from './src/context/LanguageContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<BottomTabKey>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'settings':
        return <SettingsScreen />;
      case 'reports':
        // De momento placeholder
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
        <StatusBar style="auto" />
        <View style={{ flex: 1 }}>{renderContent()}</View>

        <BottomMenu
          activeTab={activeTab}
          onTabChange={setActiveTab}
          colors={COLORS}
        />
      </SafeAreaView>
    </LanguageProvider>
  );
}
