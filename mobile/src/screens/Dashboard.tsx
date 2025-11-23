// mobile/src/screens/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getDashboardDemo } from '../services/api';
import BottomMenu from '../components/BottomMenu'; // 👈 Menú inferior
import AppHeader from '../components/AppHeader'; // 👈 Header tipo NU

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
type PeriodKey = 'hoy' | 'semana' | 'mes' | 'personalizado';

type MovementSegment = {
  id: string;
  titulo: string;
  icon: string;
  total: number;
  items: { id: string; comercio: string; monto: number }[];
};

// Paleta basada en tu diseño
const COLORS = {
  primary: '#0b1a3b', // azul oscuro principal
  background: '#d3dedc', // gris verdoso de fondo
  card: '#fffffb', // casi blanco tarjetas
  text: '#0b1a3b',
  muted: '#7d8083',

  income: '#16a34a', // verde
  expense: '#f97316', // naranja

  apiChipBg: '#0b1a3b',
  apiChipText: '#fffffb',

  navBg: '#0b1a3b',
  navIconInactive: '#cbd5e1',
  navIconActive: '#fffffb',
  navLabelInactive: '#cbd5e1',
  navLabelActive: '#fffffb',
};

// Datos mock para la UI (por ahora visual)
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

// Segmentos demo para "Resumen de movimientos"
const MOVEMENT_SEGMENTS: MovementSegment[] = [
  {
    id: 'ropa',
    titulo: 'Ropa',
    icon: 'shirt-outline',
    total: 1250,
    items: [
      { id: 'zara', comercio: 'Zara', monto: 500 },
      { id: 'bershka', comercio: 'Bershka', monto: 350 },
      { id: 'pullbear', comercio: 'Pull&Bear', monto: 400 },
    ],
  },
  {
    id: 'comida',
    titulo: 'Comida / Cafés',
    icon: 'fast-food-outline',
    total: 430,
    items: [
      { id: 'starbucks', comercio: 'Starbucks', monto: 180 },
      { id: 'mcdonalds', comercio: "McDonald's", monto: 150 },
      { id: 'local', comercio: 'Café local', monto: 100 },
    ],
  },
  {
    id: 'personal',
    titulo: 'Gasto personal',
    icon: 'person-outline',
    total: 280,
    items: [
      { id: 'netflix', comercio: 'Netflix', monto: 150 },
      { id: 'spotify', comercio: 'Spotify', monto: 80 },
      { id: 'gym', comercio: 'Gimnasio', monto: 50 },
    ],
  },
  {
    id: 'hormiga',
    titulo: 'Gasto hormiga',
    icon: 'cash-outline',
    total: 160,
    items: [
      { id: 'tiendita', comercio: 'Tiendita', monto: 40 },
      { id: 'antojito', comercio: 'Antojito', monto: 60 },
      { id: 'snacks', comercio: 'Snacks varios', monto: 60 },
    ],
  },
];

// Helper para formatear cantidades
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeBottomTab, setActiveBottomTab] =
    useState<BottomTabKey>('home');
  const [activeTopTab, setActiveTopTab] = useState<TopTabKey>('balance');

  // periodo seleccionado en “Resumen de movimientos”
  const [activePeriod, setActivePeriod] = useState<PeriodKey>('mes');

  // ocultar/mostrar saldo tipo NU
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const resumen = dashboard?.resumen ?? { ingresos: 0, gastos: 0, saldo: 0 };
  const movimientos = dashboard?.movimientos ?? []; // por si después lo usas

  // Para barra ingresos vs gastos
  const totalBar = resumen.ingresos + Math.abs(resumen.gastos) || 1;
  const fracIngresos = resumen.ingresos / totalBar;
  const fracGastos = Math.abs(resumen.gastos) / totalBar;

  // Datos de meta de ahorro (demo)
  const savingsGoal = 12500;
  const savingsSaved = 8000;
  const savingsProgress =
    savingsGoal > 0 ? Math.min(savingsSaved / savingsGoal, 1) : 0;

  // 👉 Cargar dashboard (/dashboard-demo)
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
        {/* HEADER tipo NU (campana + ojo + ? + perfil+) */}
        <AppHeader
          isBalanceHidden={isBalanceHidden}
          onToggleBalanceHidden={() =>
            setIsBalanceHidden((prev) => !prev)
          }
        />

        {/* Contenido principal con padding lateral */}
        <View style={styles.innerContent}>
          {/* CARD SALDO TOTAL */}
          <View style={styles.netWorthCard}>
            <Text style={styles.balanceLabel}>Saldo total</Text>
            <Text style={styles.balanceValue}>
              {isBalanceHidden ? '•••••••' : formatCurrency(resumen.saldo)}
            </Text>

            {/* Mensaje breve en lugar de chips de ingresos/gastos */}
            <Text style={styles.balanceHelper}>
              Aquí verás el saldo disponible de la cuenta o tarjeta que
              vinculaste.
            </Text>
          </View>

          {/* TABS superiores: Ingresos vs Gastos / Metas de Ahorro */}
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

          {/* BLOQUE PRINCIPAL Ingresos vs Gastos */}
          {activeTopTab === 'balance' && (
            <View style={styles.flowCard}>
              <View style={styles.flowHeaderRow}>
                <Text style={styles.flowTitle}>Ingresos vs gastos</Text>
                <Text style={styles.flowAmount}>
                  {formatCurrency(
                    resumen.ingresos - Math.abs(resumen.gastos),
                  )}
                </Text>
              </View>

              {/* Barra horizontal */}
              <View style={styles.flowBarBackground}>
                <View
                  style={[styles.flowBarIngresos, { flex: fracIngresos }]}
                />
                <View style={[styles.flowBarGastos, { flex: fracGastos }]} />
              </View>

              {/* Etiquetas ingresos / gastos */}
              <View style={styles.flowBottomRow}>
                <View style={styles.flowStat}>
                  <View
                    style={[
                      styles.flowDot,
                      { backgroundColor: COLORS.income },
                    ]}
                  />
                  <View>
                    <Text style={styles.flowStatLabel}>Ingresos</Text>
                    <Text
                      style={[
                        styles.flowStatValue,
                        { color: COLORS.income },
                      ]}
                    >
                      {formatCurrency(resumen.ingresos)}
                    </Text>
                  </View>
                </View>

                <View style={styles.flowStat}>
                  <View
                    style={[
                      styles.flowDot,
                      { backgroundColor: COLORS.expense },
                    ]}
                  />
                  <View>
                    <Text style={styles.flowStatLabel}>Gastos</Text>
                    <Text
                      style={[
                        styles.flowStatValue,
                        { color: COLORS.expense },
                      ]}
                    >
                      {formatCurrency(Math.abs(resumen.gastos))}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* UI para pestaña "Metas de ahorro" */}
          {activeTopTab === 'savings' && (
            <View style={styles.flowCard}>
              <View style={styles.savingsHeader}>
                <Text style={styles.savingsTitle}>Meta de ahorro</Text>
                <Text style={styles.savingsSubtitle}>
                  Progreso de tu meta mensual
                </Text>
              </View>

              {/* Barra que refleja el % ahorrado */}
              <View style={styles.savingsBarBg}>
                <View
                  style={[
                    styles.savingsBarFill,
                    { width: `${savingsProgress * 100}%` },
                  ]}
                />
              </View>

              <View style={styles.savingsRow}>
                <View style={styles.savingsStat}>
                  <View
                    style={[
                      styles.savingsDot,
                      { backgroundColor: '#2563eb' }, // azul para meta
                    ]}
                  />
                  <View>
                    <Text style={styles.savingsLabel}>Meta mensual</Text>
                    <Text style={styles.savingsValueGoal}>
                      {formatCurrency(savingsGoal)}
                    </Text>
                  </View>
                </View>

                <View style={styles.savingsStat}>
                  <View
                    style={[
                      styles.savingsDot,
                      { backgroundColor: COLORS.income }, // verde para ahorro
                    ]}
                  />
                  <View>
                    <Text style={styles.savingsLabel}>
                      Ahorro acumulado
                    </Text>
                    <Text style={styles.savingsValueSaved}>
                      {formatCurrency(savingsSaved)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* MIS CUENTAS */}
          <Text style={styles.sectionTitle}>Mis cuentas</Text>
          {MOCK_ACCOUNTS.map((acc) => (
            <View key={acc.id} style={styles.accountCard}>
              <View style={styles.accountLeft}>
                <View style={styles.accountIconCircle}>
                  <Ionicons
                    name={
                      acc.tipo === 'bank' ? 'card-outline' : 'wallet-outline'
                    }
                    size={20}
                    color={COLORS.card}
                  />
                </View>
                <View>
                  <Text style={styles.accountName}>{acc.nombre}</Text>
                  <Text style={styles.accountSubtitle}>
                    {acc.subtitulo}
                  </Text>
                </View>
              </View>
              <Text style={styles.accountBalance}>
                {formatCurrency(acc.saldo)}
              </Text>
            </View>
          ))}

          {/* ALERTAS PERSONALIZADAS */}
          <Text style={styles.sectionTitle}>Alertas personalizadas</Text>
          <View style={styles.alertsRow}>
            {MOCK_ALERTS.map((alert) => (
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

          {/* ERRORES */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* 🔹 BLOQUE: RESUMEN DE MOVIMIENTOS */}
          <View style={styles.card}>
            {/* Título + recargar con ícono */}
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>Resumen de movimientos</Text>
              {loadingDashboard ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <TouchableOpacity
                  onPress={loadDashboard}
                  style={styles.reloadIconButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="refresh" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Tabs de periodo (con icono de calendario minimalista) */}
            <View style={styles.periodTabsRow}>
              {[
                { key: 'hoy', label: 'Hoy' },
                { key: 'semana', label: 'Semana' },
                { key: 'mes', label: 'Mes' },
                { key: 'personalizado', icon: 'calendar-outline' },
              ].map((tab) => {
                const isActive = activePeriod === (tab.key as PeriodKey);
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[
                      styles.periodTab,
                      isActive && styles.periodTabActive,
                    ]}
                    onPress={() =>
                      setActivePeriod(tab.key as PeriodKey)
                    }
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

            {/* Barra de búsqueda */}
            <View style={styles.searchBar}>
              <Ionicons
                name="search-outline"
                size={16}
                color={COLORS.muted}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.searchBarPlaceholder}>
                Buscar por comercio o categoría
              </Text>
            </View>

            {/* Segmentos SIN dropdown, solo card estática */}
            {MOVEMENT_SEGMENTS.map((segment) => (
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
                      <Text style={styles.segmentTitle}>
                        {segment.titulo}
                      </Text>
                      <Text style={styles.segmentSubtitle}>
                        {formatCurrency(segment.total)} total este mes
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Espacio para que el scroll no quede detrás del nav */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Menú inferior reutilizable */}
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
    paddingHorizontal: 0, // el header maneja su propio padding
    paddingTop: 0,
  },
  innerContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },

  // Card Saldo total
  netWorthCard: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    padding: 20,
    marginTop: 8, // baja un poco el bloque respecto al header
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

  // (chips styles se quedan por si los reutilizas en otro lado)
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5edf0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },

  // Top tabs
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

  // Card Ingresos vs Gastos
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

  // Savings (pestaña "Metas de ahorro")
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
    backgroundColor: COLORS.income, // verde
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

  // Secciones
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },

  // Cuentas
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

  // Alertas
  alertsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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

  // Card genérica (Resumen de movimientos)
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

  // Utilidades
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mutedText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  errorText: {
    color: '#b91c1c',
    marginHorizontal: 20,
    marginBottom: 8,
  },

  reloadIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#edf1f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tabs de periodo
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

  // Search bar
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

  // Segmentos de categoría
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
  segmentMovements: {
    marginTop: 6,
  },

  // Movimientos dentro de segmentos (por si los quieres usar después)
  movItem: {
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
  },
  movRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  movAvatarText: {
    color: COLORS.card,
    fontWeight: '700',
    fontSize: 14,
  },
  movDescripcion: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  movCategoria: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  movFecha: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  movMonto: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  movMontoPositivo: {
    color: COLORS.income,
  },
  movMontoNegativo: {
    color: COLORS.expense,
  },
});
