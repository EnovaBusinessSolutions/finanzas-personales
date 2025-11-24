// mobile/src/components/home/AlertsSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';

type AlertCard = {
  id: string;
  titulo: string;
  subtitulo: string;
  tone: 'info' | 'warning';
};

type Props = {
  alerts: AlertCard[];
};

const STRINGS = {
  es: {
    sectionTitle: 'Alertas personalizadas',
  },
  en: {
    sectionTitle: 'Personalized alerts',
  },
};

const AlertsSection: React.FC<Props> = ({ alerts }) => {
  const { language } = useLanguage();
  const t = STRINGS[language];

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.sectionTitle}>{t.sectionTitle}</Text>
      <View style={styles.alertsRow}>
        {alerts.map((alert) => (
          <View
            key={alert.id}
            style={[
              styles.alertCard,
              alert.tone === 'warning' && styles.alertCardWarning,
            ]}
          >
            <View style={styles.alertHeaderRow}>
              <Ionicons
                name={
                  alert.tone === 'warning'
                    ? 'warning-outline'
                    : 'notifications-outline'
                }
                size={18}
                color={COLORS.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.alertTitle}>{alert.titulo}</Text>
            </View>
            <Text style={styles.alertSubtitle}>{alert.subtitulo}</Text>
          </View>
        ))}
      </View>
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
  alertsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  alertCard: {
    flex: 1,
    backgroundColor: '#e5edf0',
    borderRadius: 16,
    padding: 12,
    marginRight: 8,
  },
  alertCardWarning: {
    backgroundColor: '#fffad0',
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  alertSubtitle: {
    fontSize: 11,
    color: COLORS.text,
  },
});

export default AlertsSection;
