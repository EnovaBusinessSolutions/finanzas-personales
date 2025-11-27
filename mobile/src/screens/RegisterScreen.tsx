// mobile/src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../theme/colors';
import {
  registerUser,
  loginUser,
  saveAuthSession,
} from '../services/api';

type Props = {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
};

const RegisterScreen: React.FC<Props> = ({
  onRegisterSuccess,
  onBackToLogin,
}) => {
  const [name, setName] = useState('');              // 👈 nuevo
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ---------- Validaciones ----------
  const isValidName = (value: string) =>
    value.trim().length >= 2; // algo sencillo por ahora

  const isValidEmail = (value: string) => {
    if (!value.trim()) return false;
    const regex = /\S+@\S+\.\S+/;
    return regex.test(value.trim());
  };

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 10; // por ahora 10 dígitos MX
  };

  const isValidPassword = (value: string) =>
    value.trim().length >= 8;

  const emailsMatch =
    email.trim().toLowerCase() ===
    confirmEmail.trim().toLowerCase();

  const canContinue =
    isValidName(name) &&
    isValidEmail(email) &&
    emailsMatch &&
    isValidPhone(phone) &&
    isValidPassword(password) &&
    !loading;

  const handleContinue = async () => {
    if (!canContinue) return;

    try {
      setLoading(true);
      setErrorMsg(null);

      const trimmedName = name.trim();
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      // 1) Registrar usuario en backend (con nombre)
      await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        phone: phone.trim(),
      });

      // 2) Login inmediato para obtener token + user (que ya trae name)
      const { token, user } = await loginUser({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      // 3) Guardar sesión en el dispositivo
      await saveAuthSession(token, user);

      // 4) Avisar al padre (App.tsx) para ir a Dashboard
      onRegisterSuccess();
    } catch (err: any) {
      console.log('Error en registro:', err);

      let msg =
        'No pudimos crear tu cuenta. Intenta de nuevo.';

      if (err?.message?.includes('ya está registrado')) {
        msg = 'Este correo ya está registrado.';
      }

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* FILA SUPERIOR: botón back */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={onBackToLogin}
                style={styles.backButton}
                activeOpacity={0.7}
                disabled={loading}
              >
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            </View>

            {/* CONTENIDO PRINCIPAL */}
            <View style={styles.content}>
              {/* Bloque superior: título + inputs */}
              <View>
                <Text style={styles.title}>
                  Continúa tu registro{'\n'}con tu correo y teléfono
                </Text>
                <Text style={styles.subtitle}>
                  Aquí también puedes iniciar tu solicitud.
                </Text>

                {/* Nombre */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>¿Cómo te llamas?</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Tu nombre"
                    placeholderTextColor="#b0bcc9"
                    value={name}
                    onChangeText={setName}
                    selectionColor={COLORS.primary}
                    editable={!loading}
                  />
                </View>

                {/* Correo */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>
                    Escribe tu correo electrónico
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor="#b0bcc9"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                    selectionColor={COLORS.primary}
                    editable={!loading}
                  />
                </View>

                {/* Confirmación correo */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>
                    Confirma tu correo electrónico
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Repite tu correo electrónico"
                    placeholderTextColor="#b0bcc9"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={confirmEmail}
                    onChangeText={setConfirmEmail}
                    selectionColor={COLORS.primary}
                    editable={!loading}
                  />
                </View>

                {/* Teléfono con bandera 🇲🇽 +52 */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>
                    Escribe los 10 dígitos de tu número celular
                  </Text>

                  <View style={styles.phoneRow}>
                    <View style={styles.prefixBox}>
                      <Text style={styles.prefixText}>
                        🇲🇽  +52
                      </Text>
                    </View>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="Tu número celular"
                      placeholderTextColor="#b0bcc9"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phone}
                      onChangeText={setPhone}
                      selectionColor={COLORS.primary}
                      editable={!loading}
                    />
                  </View>
                </View>

                {/* Contraseña */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>
                    Crea una contraseña
                  </Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Mínimo 8 caracteres"
                      placeholderTextColor="#b0bcc9"
                      secureTextEntry={secure}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={password}
                      onChangeText={setPassword}
                      selectionColor={COLORS.primary}
                      editable={!loading}
                      returnKeyType="done"
                      onSubmitEditing={handleContinue}
                    />
                    <TouchableOpacity
                      onPress={() => setSecure(prev => !prev)}
                      style={styles.eyeButton}
                      hitSlop={{
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10,
                      }}
                      disabled={loading}
                    >
                      <Ionicons
                        name={
                          secure
                            ? 'eye-off-outline'
                            : 'eye-outline'
                        }
                        size={20}
                        color={COLORS.muted}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Error */}
                {errorMsg && (
                  <View style={styles.errorWrapper}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                  </View>
                )}
              </View>

              {/* Bloque inferior: botón + aviso de privacidad */}
              <View>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    !canContinue && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleContinue}
                  activeOpacity={0.9}
                  disabled={!canContinue}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      Continuar
                    </Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.legalText}>
                  Al continuar aceptas nuestro{' '}
                  <Text style={styles.legalLink}>
                    Aviso de privacidad
                  </Text>{' '}
                  y que HappyLife pueda contactarte cuando sea
                  necesario.
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // estilo hoja limpia tipo NU
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerRow: {
    height: 40,
    justifyContent: 'center',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Distribuimos mejor: arriba texto/inputs, abajo botón + legal
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 16,
    marginRight: 24,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
    marginTop: 12,
    marginBottom: 24,
  },

  fieldGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#dde3eb',
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  prefixBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f2f4f8',
    marginRight: 10,
    minWidth: 74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prefixText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  phoneInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dde3eb',
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
  },

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dde3eb',
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  eyeButton: {
    marginLeft: 10,
  },

  errorWrapper: {
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
  },

  primaryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#dde3eb',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  legalText: {
    marginTop: 16,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.muted,
    textAlign: 'left',
  },
  legalLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
