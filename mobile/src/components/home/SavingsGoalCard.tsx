import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { formatCurrency } from '../../utils/formatCurrency';

type Props = {
  goal: number;
  saved: number;
};

const SavingsGoalCard: React.FC<Props> = ({ goal, saved }) => {
  const progress = goal > 0 ? Math.min(saved / goal, 1) : 0;

  return (
    <View style={styles.flowCard}>
      <View style={styles.savingsHeader}>
        <Text style={styles.savingsTitle}>Meta de ahorro</Text>
        <Text style={styles.savingsSubtitle}>
          Progreso de tu meta mensual
        </Text>
      </View>

      <View style={styles.savingsBarBg}>
        <View
          style={[styles.savingsBarFill, { width: `${progress * 100}%` }]}
        />
      </View>

      <View style={styles.savingsRow}>
        <View style={styles.savingsStat}>
          <View
            style={[
              styles.savingsDot,
              { backgroundColor: '#2563eb' },
            ]}
          />
          <View>
            <Text style={styles.savingsLabel}>Meta mensual</Text>
            <Text style={styles.savingsValueGoal}>
              {formatCurrency(goal)}
            </Text>
          </View>
        </View>

        <View style={styles.savingsStat}>
          <View
            style={[
              styles.savingsDot,
              { backgroundColor: COLORS.income },
            ]}
          />
          <View>
            <Text style={styles.savingsLabel}>Ahorro acumulado</Text>
            <Text style={styles.savingsValueSaved}>
              {formatCurrency(saved)}
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
  savingsHeader: {
    marginBottom: 10,
  },
  savingsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  savingsSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  savingsBarBg: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 12,
  },
  savingsBarFill: {
    height: '100%',
    backgroundColor: COLORS.income,
    borderRadius: 999,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  savingsStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  savingsLabel: {
    fontSize: 12,
    color: COLORS.muted,
  },
  savingsValueGoal: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  savingsValueSaved: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.income,
  },
});

export default SavingsGoalCard;
