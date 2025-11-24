import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { formatCurrency } from '../../utils/formatCurrency';

type Props = {
  ingresos: number;
  gastos: number;
};

const IncomeVsExpensesCard: React.FC<Props> = ({ ingresos, gastos }) => {
  const totalBar = ingresos + Math.abs(gastos) || 1;
  const fracIngresos = ingresos / totalBar;
  const fracGastos = Math.abs(gastos) / totalBar;

  return (
    <View style={styles.flowCard}>
      <View style={styles.flowHeaderRow}>
        <Text style={styles.flowTitle}>Ingresos vs gastos</Text>
        <Text style={styles.flowAmount}>
          {formatCurrency(ingresos - Math.abs(gastos))}
        </Text>
      </View>

      <View style={styles.flowBarBackground}>
        <View style={[styles.flowBarIngresos, { flex: fracIngresos }]} />
        <View style={[styles.flowBarGastos, { flex: fracGastos }]} />
      </View>

      <View style={styles.flowBottomRow}>
        <View style={styles.flowStat}>
          <View
            style={[styles.flowDot, { backgroundColor: COLORS.income }]}
          />
          <View>
            <Text style={styles.flowStatLabel}>Ingresos</Text>
            <Text
              style={[
                styles.flowStatValue,
                { color: COLORS.income },
              ]}
            >
              {formatCurrency(ingresos)}
            </Text>
          </View>
        </View>

        <View style={styles.flowStat}>
          <View
            style={[styles.flowDot, { backgroundColor: COLORS.expense }]}
          />
          <View>
            <Text style={styles.flowStatLabel}>Gastos</Text>
            <Text
              style={[
                styles.flowStatValue,
                { color: COLORS.expense },
              ]}
            >
              {formatCurrency(Math.abs(gastos))}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flowCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
  },
  flowHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  flowTitle: {
    fontSize: 15,
    color: COLORS.muted,
  },
  flowAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  flowBarBackground: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    marginBottom: 10,
  },
  flowBarIngresos: {
    backgroundColor: COLORS.income,
  },
  flowBarGastos: {
    backgroundColor: COLORS.expense,
  },
  flowBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  flowStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  flowStatLabel: {
    fontSize: 11,
    color: COLORS.muted,
  },
  flowStatValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default IncomeVsExpensesCard;
