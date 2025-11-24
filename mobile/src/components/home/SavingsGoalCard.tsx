// mobile/src/components/home/SavingsGoalCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { formatCurrency } from '../../utils/formatCurrency';
import { useLanguage } from '../../context/LanguageContext';

type Props = {
  goal: number;
  saved: number;
};

const STRINGS = {
  es: {
    title: 'Meta de ahorro',
    subtitle: 'Progreso de tu meta mensual',
    monthlyGoal: 'Meta mensual',
    accumulatedSavings: 'Ahorro acumulado',
  },
  en: {
    title: 'Savings goal',
    subtitle: 'Progress towards your monthly goal',
    monthlyGoal: 'Monthly goal',
    accumulatedSavings: 'Saved so far',
  },
};

const SavingsGoalCard: React.FC<Props> = ({ goal, saved }) => {
  const { language } = useLanguage();
  const t = STRINGS[language];

  const progress = goal > 0 ? Math.min(saved / goal, 1) : 0;

  return (
    <View style={styles.flowCard}>
      <View style={styles.savingsHeader}>
        <Text style={styles.savingsTitle}>{t.title}</Text>
        <Text style={styles.savingsSubtitle}>{t.subtitle}</Text>
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
            <Text style={styles.savingsLabel}>{t.monthlyGoal}</Text>
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
            <Text style={styles.savingsLabel}>{t.accumulatedSavings}</Text>
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
