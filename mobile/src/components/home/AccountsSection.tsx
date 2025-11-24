import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../theme/colors';
import { formatCurrency } from '../../utils/formatCurrency';

type Account = {
  id: string;
  nombre: string;
  subtitulo: string;
  saldo: number;
  tipo: 'bank' | 'card';
};

type Props = {
  accounts: Account[];
};

const AccountsSection: React.FC<Props> = ({ accounts }) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.sectionTitle}>Mis cuentas</Text>
      {accounts.map((acc) => (
        <View key={acc.id} style={styles.accountCard}>
          <View style={styles.accountLeft}>
            <View style={styles.accountIconCircle}>
              <Ionicons
                name={acc.tipo === 'bank' ? 'card-outline' : 'wallet-outline'}
                size={20}
                color={COLORS.card}
              />
            </View>
            <View>
              <Text style={styles.accountName}>{acc.nombre}</Text>
              <Text style={styles.accountSubtitle}>{acc.subtitulo}</Text>
            </View>
          </View>
          <Text style={styles.accountBalance}>
            {formatCurrency(acc.saldo)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  accountCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.card,
  },
  accountSubtitle: {
    fontSize: 12,
    color: '#cbd5f5',
    marginTop: 2,
  },
  accountBalance: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.card,
  },
});

export default AccountsSection;
