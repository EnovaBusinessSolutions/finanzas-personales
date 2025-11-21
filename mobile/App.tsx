import React from 'react';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Dashboard from './src/screens/Dashboard';


export default function App() {
return (
<SafeAreaView style={{ flex: 1 }}>
<Dashboard />
<StatusBar style="auto" />
</SafeAreaView>
);
}