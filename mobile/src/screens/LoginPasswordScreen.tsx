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
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../theme/colors';
import { loginUser } from '../services/api';

// 👇 mismo tipo local que usamos también en LoginEmailScreen
type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Register: undefined;
  LoginEmail: undefined;
  LoginPassword: { email: string }; // recibe el correo
  Dashboard: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'LoginPassword'>;

const LoginPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params; // 👈 correo que viene de la pantalla anterior

  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isValidPassword = (value: string) => value.trim().length >= 8;

  const handleNext = async () => {
    if (!isValidPassword(password) || loading) return;

    try {
      setLoading(true);
      setErrorMsg(null);

      // 🔐 Llamamos a la API real de login
      const { token, user } = await loginUser({
        email: email.trim(),
        password: password.trim(),
      });

      // 💾 Guardamos credenciales básicas en AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('authUser', JSON.stringify(user));

      // Opcional: limpiar password en memoria
      setPassword('');

      // 🔁 Reset de navegación para entrar a la app
      // y que no pueda volver al login con “back”
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (err: any) {
      console.log('Error en login:', err);

      // Mensaje amigable según el tipo de error
      const generic =
        'Correo o contraseña incorrectos. Intenta de nuevo.';
      const msgFromError =
        typeof err?.message === 'string' ? err.message : generic;

      // Si es 401/403 o algo así, dejamos el mensaje genérico,
      // si no, mostramos el de red/servidor:
      if (/401|403/i.test(msgFromError)) {
        setErrorMsg(generic);
      } else {
        setErrorMsg(msgFromError || generic);
      }
    } finally {
      setLoading(false);
    }
  };

  const canContinue = isValidPassword(password) && !loading;

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
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                disabled={loading}
              >
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
                  editable={!loading}
                  returnKeyType="done"
                  onSubmitEditing={handleNext}
                />

                {/* Ojo mostrar/ocultar */}
                <TouchableOpacity
                  onPress={() => setSecure(prev => !prev)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  disabled={loading}
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

            {/* Mensaje de error */}
            {errorMsg && (
              <View style={styles.errorWrapper}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            {/* Olvidé la contraseña */}
            <TouchableOpacity
              style={styles.forgotWrapper}
              onPress={() => {
                // TODO: flujo de recuperación de contraseña
              }}
              disabled={loading}
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
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Ionicons
                  name="arrow-forward"
                  size={26}
                  color={canContinue ? '#FFFFFF' : '#9CA3AF'}
                />
              )}
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
  errorWrapper: {
    marginTop: 12,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
  },
  forgotWrapper: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  forgotText: {
    fontSize: 15,
    color: COLORS.primary,
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
