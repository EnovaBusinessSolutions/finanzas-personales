// mobile/src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;   // 🔹 ESTA ES LA PROP QUE FALTABA
};

const RegisterScreen: React.FC<Props> = ({ onRegisterSuccess, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    // Aquí después irá la llamada real al backend
    onRegisterSuccess();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Flecha atrás / Volver al login */}
        <TouchableOpacity onPress={onBackToLogin} style={styles.backButton}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>

        {/* Título estilo NU */}
        <View style={styles.headerBlock}>
          <Text style={styles.title}>
            Continúa tu registro{'\n'}con tu correo y teléfono
          </Text>
          <Text style={styles.subtitle}>
            Aquí también puedes iniciar tu solicitud.
          </Text>
        </View>

        {/* Campos */}
        <View style={styles.form}>
          <Text style={styles.label}>Escribe tu correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#B0B6C0"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Confirma tu correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Repite tu correo electrónico"
            placeholderTextColor="#B0B6C0"
            keyboardType="email-address"
            autoCapitalize="none"
            value={confirmEmail}
            onChangeText={setConfirmEmail}
          />

          <Text style={styles.label}>Escribe los 10 dígitos de tu número celular</Text>
          <View style={styles.phoneRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+52</Text>
            </View>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder="Tu número celular"
              placeholderTextColor="#B0B6C0"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        {/* Botón continuar */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.card, // fondo blanco limpio
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 8,
  },
  backArrow: {
    fontSize: 28,
    color: COLORS.text,
  },
  headerBlock: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: COLORS.primary, // o COLORS.text si prefieres
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
  },
  form: {
    marginTop: 8,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 14,
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E3E8',
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F2F3F7',
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: COLORS.text,
  },
  phoneInput: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegisterScreen;
