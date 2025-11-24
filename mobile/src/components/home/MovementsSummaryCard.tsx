// mobile/src/components/home/MovementsSummaryCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../theme/colors';
import { formatCurrency } from '../../utils/formatCurrency';
import { useLanguage } from '../../context/LanguageContext';

export type PeriodKey = 'hoy' | 'semana' | 'mes' | 'personalizado';

type MovementSegment = {
  id: string;
  titulo: string;
  icon: string;
  total: number;
};

type Props = {
  segments: MovementSegment[];
  activePeriod: PeriodKey;
  onChangePeriod: (period: PeriodKey) => void;
  loading: boolean;
  onReload: () => void;
};

const STRINGS = {
  es: {
    cardTitle: 'Resumen de movimientos',
    today: 'Hoy',
    week: 'Semana',
    month: 'Mes',
    searchPlaceholder: 'Buscar por comercio o categoría',
    totalThisMonth: 'total este mes',
  },
  en: {
    cardTitle: 'Transactions summary',
    today: 'Today',
    week: 'Week',
    month: 'Month',
    searchPlaceholder: 'Search by merchant or category',
    totalThisMonth: 'total this month',
  },
};

const MovementsSummaryCard: React.FC<Props> = ({
  segments,
  activePeriod,
  onChangePeriod,
  loading,
  onReload,
}) => {
  const { language } = useLanguage();
  const t = STRINGS[language];

  const periodTabs = [
    { key: 'hoy' as PeriodKey, label: t.today },
    { key: 'semana' as PeriodKey, label: t.week },
    { key: 'mes' as PeriodKey, label: t.month },
    { key: 'personalizado' as PeriodKey, icon: 'calendar-outline' },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardTitle}>{t.cardTitle}</Text>
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <TouchableOpacity
            onPress={onReload}
            style={styles.reloadIconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="refresh" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs de periodo */}
      <View style={styles.periodTabsRow}>
        {periodTabs.map((tab) => {
          const isActive = activePeriod === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.periodTab,
                isActive && styles.periodTabActive,
              ]}
              onPress={() => onChangePeriod(tab.key)}
            >
              {tab.icon ? (
                <Ionicons
                  name={tab.icon as any}
                  size={18}
                  style={styles.periodTabIcon}
                  color={isActive ? COLORS.card : COLORS.muted}
                />
              ) : (
                <Text
                  style={[
                    styles.periodTabText,
                    isActive && styles.periodTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={16}
          color={COLORS.muted}
          style={{ marginRight: 6 }}
        />
        <Text style={styles.searchBarPlaceholder}>
          {t.searchPlaceholder}
        </Text>
      </View>

      {/* Segmentos */}
      {segments.map((segment) => (
        <View key={segment.id} style={styles.segmentCard}>
          <View style={styles.segmentHeader}>
            <View style={styles.segmentHeaderLeft}>
              <View style={styles.segmentIconCircle}>
                <Ionicons
                  name={segment.icon as any}
                  size={22}
                  color={COLORS.card}
                />
              </View>
              <View>
                <Text style={styles.segmentTitle}>{segment.titulo}</Text>
                <Text style={styles.segmentSubtitle}>
                  {formatCurrency(segment.total)} {t.totalThisMonth}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reloadIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#edf1f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodTabsRow: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 14,
  },
  periodTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 999,
  },
  periodTabActive: {
    backgroundColor: COLORS.primary,
  },
  periodTabText: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '500',
  },
  periodTabTextActive: {
    color: COLORS.card,
    fontWeight: '600',
  },
  periodTabIcon: {
    marginTop: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf1f5',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchBarPlaceholder: {
    fontSize: 13,
    color: COLORS.muted,
  },
  segmentCard: {
    borderRadius: 18,
    backgroundColor: '#f5f7fa',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  segmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  segmentIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  segmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  segmentSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
});

export default MovementsSummaryCard;
