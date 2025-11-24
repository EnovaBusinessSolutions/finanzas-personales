import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { getDashboardDemo } from '../services/api';
import BottomMenu from '../components/BottomMenu';
import AppHeader from '../components/AppHeader';
import BalanceCard from '../components/home/BalanceCard';
import IncomeVsExpensesCard from '../components/home/IncomeVsExpensesCard';
import SavingsGoalCard from '../components/home/SavingsGoalCard';
import AccountsSection from '../components/home/AccountsSection';
import AlertsSection from '../components/home/AlertsSection';
import MovementsSummaryCard, { PeriodKey } from '../components/home/MovementsSummaryCard';
import { COLORS } from '../theme/colors';

// Tipos
type Movimiento = {
  id: number;
  fecha: string;
  descripcion: string;
  categoria: string;
  monto: number;
};

type DashboardResponse = {
  ok?: boolean;
  resumen: {
    ingresos: number;
    gastos: number;
    saldo: number;
  };
  movimientos: Movimiento[];
};

type Account = {
  id: string;
  nombre: string;
  subtitulo: string;
  saldo: number;
  tipo: 'bank' | 'card';
};

type AlertCard = {
  id: string;
  titulo: string;
  subtitulo: string;
  tone: 'info' | 'warning';
};

type BottomTabKey = 'home' | 'reports' | 'goals' | 'settings';
type TopTabKey = 'balance' | 'savings';

type MovementSegment = {
  id: string;
  titulo: string;
  icon: string;
  total: number;
  items: { id: string; comercio: string; monto: number }[];
};

// Mocks
const MOCK_ACCOUNTS: Account[] = [
  {
    id: '1',
    nombre: 'Banco principal',
    subtitulo: 'Saldo disponible',
    saldo: 54600,
    tipo: 'bank',
  },
  {
    id: '2',
    nombre: 'Mastercard',
    subtitulo: 'Deuda actual',
    saldo: -930,
    tipo: 'card',
  },
];

const MOCK_ALERTS: AlertCard[] = [
  {
    id: '1',
    titulo: 'Pago próximo: Spotify Premium',
    subtitulo: 'Vence el 15 de noviembre',
    tone: 'info',
  },
  {
    id: '2',
    titulo: 'Te excediste en restaurantes',
    subtitulo: 'Vas $450 arriba del presupuesto',
    tone: 'warning',
  },
];

const MOVEMENT_SEGMENTS: MovementSegment[] = [
  {
    id: 'ropa',
    titulo: 'Ropa',
    icon: 'shirt-outline',
    total: 1250,
    items: [],
  },
  {
    id: 'comida',
    titulo: 'Comida / Cafés',
    icon: 'fast-food-outline',
    total: 430,
    items: [],
  },
  {
    id: 'personal',
    titulo: 'Gasto personal',
    icon: 'person-outline',
    total: 280,
    items: [],
  },
  {
    id: 'hormiga',
    titulo: 'Gasto hormiga',
    icon: 'cash-outline',
    total: 160,
    items: [],
  },
];

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeBottomTab, setActiveBottomTab] =
    useState<BottomTabKey>('home');
  const [activeTopTab, setActiveTopTab] = useState<TopTabKey>('balance');

  const [activePeriod, setActivePeriod] = useState<PeriodKey>('mes');
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const resumen = dashboard?.resumen ?? { ingresos: 0, gastos: 0, saldo: 0 };
  const savingsGoal = 12500;
  const savingsSaved = 8000;

  async function loadDashboard() {
    try {
      setLoadingDashboard(true);
      setError(null);
      const data = await getDashboardDemo();
      setDashboard(data);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? 'Error cargando dashboard');
    } finally {
      setLoadingDashboard(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <AppHeader
          isBalanceHidden={isBalanceHidden}
          onToggleBalanceHidden={() =>
            setIsBalanceHidden((prev) => !prev)
          }
        />

        <View style={styles.innerContent}>
          <BalanceCard saldo={resumen.saldo} isHidden={isBalanceHidden} />

          {/* Tabs superiores */}
          <View style={styles.topTabsRow}>
            <TouchableOpacity
              style={[
                styles.topTab,
                activeTopTab === 'balance' && styles.topTabActive,
              ]}
              onPress={() => setActiveTopTab('balance')}
            >
              <Text
                style={[
                  styles.topTabText,
                  activeTopTab === 'balance' && styles.topTabTextActive,
                ]}
              >
                Ingresos vs. gastos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.topTab,
                activeTopTab === 'savings' && styles.topTabActive,
              ]}
              onPress={() => setActiveTopTab('savings')}
            >
              <Text
                style={[
                  styles.topTabText,
                  activeTopTab === 'savings' && styles.topTabTextActive,
                ]}
              >
                Metas de ahorro
              </Text>
            </TouchableOpacity>
          </View>

          {activeTopTab === 'balance' && (
            <IncomeVsExpensesCard
              ingresos={resumen.ingresos}
              gastos={resumen.gastos}
            />
          )}

          {activeTopTab === 'savings' && (
            <SavingsGoalCard goal={savingsGoal} saved={savingsSaved} />
          )}

          <AccountsSection accounts={MOCK_ACCOUNTS} />

          <AlertsSection alerts={MOCK_ALERTS} />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <MovementsSummaryCard
            segments={MOVEMENT_SEGMENTS.map(({ id, titulo, icon, total }) => ({
              id,
              titulo,
              icon,
              total,
            }))}
            activePeriod={activePeriod}
            onChangePeriod={(p) => setActivePeriod(p)}
            loading={loadingDashboard}
            onReload={loadDashboard}
          />

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      <BottomMenu
        activeTab={activeBottomTab}
        onTabChange={setActiveBottomTab}
        colors={COLORS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  innerContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  topTabsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  topTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  topTabActive: {
    backgroundColor: COLORS.card,
  },
  topTabText: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '500',
  },
  topTabTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  errorText: {
    color: '#b91c1c',
    marginBottom: 8,
  },
});
