// mobile/src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../theme/colors';

type Props = {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
};

const RegisterScreen: React.FC<Props> = ({
  onRegisterSuccess,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleContinue = () => {
    // Más adelante aquí validaremos y llamaremos al backend.
    onRegisterSuccess();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* FILA SUPERIOR: botón back */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={onBackToLogin}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color={COLORS.text} />
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

            {/* Correo */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Escribe tu correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#b0bcc9"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Confirmación correo */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirma tu correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="Repite tu correo electrónico"
                placeholderTextColor="#b0bcc9"
                keyboardType="email-address"
                autoCapitalize="none"
                value={confirmEmail}
                onChangeText={setConfirmEmail}
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
                />
              </View>
            </View>
          </View>

          {/* Bloque inferior: botón + aviso de privacidad */}
          <View>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContinue}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>Continuar</Text>
            </TouchableOpacity>

            <Text style={styles.legalText}>
              Al continuar aceptas nuestro{' '}
              <Text style={styles.legalLink}>Aviso de privacidad</Text> y que
              HappyLife pueda contactarte cuando sea necesario.
            </Text>
          </View>
        </View>
      </View>
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

  primaryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
