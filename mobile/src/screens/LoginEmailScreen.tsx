// src/screens/LoginEmailScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Register: undefined;
  LoginEmail: undefined;
  Dashboard: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'LoginEmail'>;

const LoginEmailScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const isValidEmail = (value: string) => {
    if (!value.trim()) return false;
    // Validación sencilla
    const regex = /\S+@\S+\.\S+/;
    return regex.test(value.trim());
  };

  const handleNext = () => {
    if (!isValidEmail(email)) return;

    // Aquí después podrás hacer la lógica real de login (API, etc.)
    // De momento lo mandamos al Dashboard simulando login exitoso.
    navigation.replace('Dashboard'); // 👈 sin segundo parámetro
  };

  const canContinue = isValidEmail(email);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* Header superior (flecha atrás + icono ojo/help) */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} />
              </TouchableOpacity>

              {/* Icono tipo NU (ojo/secreto) */}
              <TouchableOpacity onPress={() => { /* luego puedes abrir ayuda */ }}>
                <Ionicons name="eye-outline" size={22} />
              </TouchableOpacity>
            </View>

            {/* Título grande */}
            <Text style={styles.title}>
              Escribe tu correo{'\n'}electrónico
            </Text>

            {/* Campo de correo */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#b3b3b3"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor="#8A2BE2" // moradito tipo NU
              />
            </View>

            {/* Botón flotante de flecha (abajo derecha) */}
            <TouchableOpacity
              style={[styles.fab, !canContinue && styles.fabDisabled]}
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={!canContinue}
            >
              <Ionicons name="arrow-forward" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
    marginTop: 24,
    paddingHorizontal: 20,
    lineHeight: 34,
  },
  inputWrapper: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 18,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    color: '#111111',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111827', // azul/marino oscuro tipo HappyLife
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabDisabled: {
    opacity: 0.25,
  },
});

export default LoginEmailScreen;
