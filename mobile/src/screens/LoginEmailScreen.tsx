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
import { COLORS } from '../theme/colors';

type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Register: undefined;
  LoginEmail: undefined;
  Dashboard: undefined;
  LoginPassword: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'LoginEmail'>;

const LoginEmailScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const isValidEmail = (value: string) => {
    if (!value.trim()) return false;
    const regex = /\S+@\S+\.\S+/;
    return regex.test(value.trim());
  };

  const handleNext = () => {
  if (!isValidEmail(email)) return;
  navigation.navigate('LoginPassword');
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
            {/* Header superior (solo flecha atrás) */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            </View>

            {/* Título grande + subtítulo */}
            <View style={styles.titleBlock}>
              <Text style={styles.title}>
                Escribe tu correo{'\n'}electrónico
              </Text>
              <Text style={styles.subtitle}>
                Usaremos este correo para enviarte información importante
                sobre tu cuenta.
              </Text>
            </View>

            {/* Campo de correo */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="correo@ejemplo.com"
                placeholderTextColor={COLORS.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor={COLORS.primary}
              />
            </View>

            {/* Botón flotante de flecha (abajo derecha) */}
            <TouchableOpacity
              style={[
                styles.fab,
                !canContinue && styles.fabDisabled,
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={!canContinue}
            >
              <Ionicons
                name="arrow-forward"
                size={26}
                color={canContinue ? '#FFFFFF' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // 👉 Fondo blanco como antes
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  titleBlock: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
  },
  inputWrapper: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 18,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    color: COLORS.text,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  fabDisabled: {
    backgroundColor: '#E5E7EB',
  },
});

export default LoginEmailScreen;
