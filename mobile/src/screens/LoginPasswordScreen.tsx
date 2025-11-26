// src/screens/LoginPasswordScreen.tsx
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
  LoginPassword: undefined;
  Dashboard: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'LoginPassword'>;

const LoginPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  const isValidPassword = (value: string) => value.trim().length >= 8;

  const handleNext = () => {
    if (!isValidPassword(password)) return;

    // ✅ Cuando la contraseña es válida y el botón está habilitado,
    // al tocar la flecha se va al Dashboard
    navigation.replace('Dashboard');
  };

  const canContinue = isValidPassword(password);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* Header superior (flecha atrás) */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            </View>

            {/* Título grande, mismo estilo que correo */}
            <View style={styles.titleBlock}>
              <Text style={styles.title}>
                Ahora ingresa tu{'\n'}contraseña del app
              </Text>
            </View>

            {/* Campo de contraseña */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="8 dígitos o más"
                  placeholderTextColor={COLORS.muted}
                  secureTextEntry={secure}
                  autoCapitalize="none"
                  autoCorrect={false}
                  selectionColor={COLORS.primary}
                />

                {/* Ojo mostrar/ocultar */}
                <TouchableOpacity
                  onPress={() => setSecure(prev => !prev)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={secure ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={COLORS.muted}
                  />
                </TouchableOpacity>
              </View>

              {/* Línea inferior igual que en correo */}
              <View style={styles.bottomLine} />
            </View>

            {/* Olvidé la contraseña */}
            <TouchableOpacity
              style={styles.forgotWrapper}
              onPress={() => {
                // Aquí luego metemos flujo de recuperación
              }}
            >
              <Text style={styles.forgotText}>
                Olvidé la contraseña  →
              </Text>
            </TouchableOpacity>

            {/* Botón flotante de flecha */}
            <TouchableOpacity
              style={[styles.fab, !canContinue && styles.fabDisabled]}
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
  },
  inputWrapper: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 10,
    color: COLORS.text,
  },
  bottomLine: {
    marginTop: 4,
    height: 2,
    backgroundColor: '#E5E7EB',
  },
  forgotWrapper: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  forgotText: {
    fontSize: 15,
    color: COLORS.primary, // 👈 ahora usa el color principal de tu app
    fontWeight: '600',
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

export default LoginPasswordScreen;
