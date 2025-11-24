// mobile/src/components/home/BalanceCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { formatCurrency } from '../../utils/formatCurrency';
import { useLanguage } from '../../context/LanguageContext';

type BalanceCardProps = {
  saldo: number;
  isHidden: boolean;
};

const STRINGS = {
  es: {
    label: 'Saldo total',
    helper:
      'Aquí verás el saldo disponible de la cuenta o tarjeta que vinculaste.',
  },
  en: {
    label: 'Total balance',
    helper:
      'Here you’ll see the available balance of the linked account or card.',
  },
};

const BalanceCard: React.FC<BalanceCardProps> = ({ saldo, isHidden }) => {
  const { language } = useLanguage();
  const t = STRINGS[language];

  return (
    <View style={styles.netWorthCard}>
      <Text style={styles.balanceLabel}>{t.label}</Text>
      <Text style={styles.balanceValue}>
        {isHidden ? '•••••••' : formatCurrency(saldo)}
      </Text>
      <Text style={styles.balanceHelper}>{t.helper}</Text>
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
