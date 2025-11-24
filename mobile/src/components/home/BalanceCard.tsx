import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { formatCurrency } from '../../utils/formatCurrency';

type BalanceCardProps = {
  saldo: number;
  isHidden: boolean;
};

const BalanceCard: React.FC<BalanceCardProps> = ({ saldo, isHidden }) => {
  return (
    <View style={styles.netWorthCard}>
      <Text style={styles.balanceLabel}>Saldo total</Text>
      <Text style={styles.balanceValue}>
        {isHidden ? '•••••••' : formatCurrency(saldo)}
      </Text>
      <Text style={styles.balanceHelper}>
        Aquí verás el saldo disponible de la cuenta o tarjeta que vinculaste.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  netWorthCard: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    padding: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 18,
    color: COLORS.muted,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  balanceHelper: {
    fontSize: 13,
    color: COLORS.muted,
  },
});

export default BalanceCard;
