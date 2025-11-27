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
  ScrollView,
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

// 👉 Helper para poner mayúscula a cada palabra del nombre
function normalizeName(raw: string): string {
  return raw
    .normalize('NFC') // buena práctica para acentos
    .trim()
    .split(/\s+/) // separa por espacios múltiples
    .filter(Boolean)
    .map(word => {
      const lower = word.toLocaleLowerCase('es-MX');
      return (
        lower.charAt(0).toLocaleUpperCase('es-MX') +
        lower.slice(1)
      );
    })
    .join(' ');
}

const RegisterScreen: React.FC<Props> = ({
  onRegisterSuccess,
  onBackToLogin,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ---------- Validaciones ----------
  const isValidName = (value: string) => value.trim().length >= 2;

  const isValidEmail = (value: string) => {
    if (!value.trim()) return false;
    const regex = /\S+@\S+\.\S+/;
    return regex.test(value.trim());
  };

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 10; // 10 dígitos MX
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

      // 🔹 Normalizamos el nombre antes de mandarlo al backend
      const normalizedName = normalizeName(name);
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      // 1) Registrar usuario en backend (con nombre normalizado)
      await registerUser({
        name: normalizedName,
        email: trimmedEmail,
        password: trimmedPassword,
        phone: phone.trim(),
      });

      // 2) Login inmediato para obtener token + user
      const { token, user } = await loginUser({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      // 3) Guardar sesión en el dispositivo
      await saveAuthSession(token, user);

      // 4) Ir al Dashboard
      onRegisterSuccess();
    } catch (err: any) {
      console.log('Error en registro:', err);

      let msg = 'No pudimos crear tu cuenta. Intenta de nuevo.';
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

            {/* CONTENIDO + SCROLL */}
            <View style={styles.content}>
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
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
    keyboardType="default"       // 👈 teclado normal con espacio
    autoCapitalize="words"       // 👈 pone mayúscula al iniciar cada palabra
    autoCorrect={true}           // 👈 deja que iOS ayude con acentos, etc.
    returnKeyType="next"
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
                      <Text style={styles.prefixText}>🇲🇽  +52</Text>
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
                        size={22}
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

                {/* Aviso de privacidad (dentro del scroll) */}
                <Text style={styles.legalText}>
                  Al continuar aceptas nuestro{' '}
                  <Text style={styles.legalLink}>
                    Aviso de privacidad
                  </Text>{' '}
                  y que HappyLife pueda contactarte cuando sea
                  necesario.
                </Text>
              </ScrollView>

              {/* CTA fijo abajo */}
              <View style={styles.bottomArea}>
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
    paddingBottom: 12,
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

  content: {
    flex: 1,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 20,
    marginRight: 24,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.muted,
    marginTop: 14,
    marginBottom: 28,
  },

  fieldGroup: {
    marginBottom: 26,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#dde3eb',
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
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
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  phoneInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#dde3eb',
    paddingVertical: 12,
    fontSize: 16,
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
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  eyeButton: {
    marginLeft: 10,
  },

  errorWrapper: {
    marginTop: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
  },

  legalText: {
    marginTop: 18,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.muted,
    textAlign: 'left',
  },
  legalLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Zona inferior fija para el botón
  bottomArea: {
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },

  primaryButton: {
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
});

export default RegisterScreen;
