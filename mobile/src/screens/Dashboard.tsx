// mobile/src/screens/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getDashboardDemo } from '../services/api';
import BottomMenu from '../components/BottomMenu'; // 👈 Menú separado

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

// Helper para formatear cantidades
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

type BottomTabKey = 'home' | 'reports' | 'goals' | 'settings';
type TopTabKey = 'balance' | 'savings';
type PeriodKey = 'hoy' | 'semana' | 'mes' | 'personalizado';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeBottomTab, setActiveBottomTab] =
    useState<BottomTabKey>('home');
  const [activeTopTab, setActiveTopTab] = useState<TopTabKey>('balance');

  // nuevo: periodo seleccionado en “Resumen de movimientos”
  const [activePeriod, setActivePeriod] =
    useState<PeriodKey>('mes');
  // nuevo: dropdown de movimientos abierto/cerrado
  const [showMovements, setShowMovements] = useState(true);

  const resumen = dashboard?.resumen ?? { ingresos: 0, gastos: 0, saldo: 0 };
  const movimientos = dashboard?.movimientos ?? [];

  // Para barra ingresos vs gastos
  const totalBar = resumen.ingresos + Math.abs(resumen.gastos) || 1;
  const fracIngresos = resumen.ingresos / totalBar;
  const fracGastos = Math.abs(resumen.gastos) / totalBar;

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
        {/* HEADER – sólo iconos arriba */}
        <View style={styles.headerRow}>
          <Ionicons name="close" size={22} color={COLORS.muted} />
          <View style={{ width: 26 }} />
          <Ionicons
            name="person-circle-outline"
            size={26}
            color={COLORS.primary}
          />
        </View>

        {/* CARD SALDO TOTAL */}
        <View style={styles.netWorthCard}>
          <Text style={styles.balanceLabel}>Saldo total</Text>
          <Text style={styles.balanceValue}>
            {formatCurrency(resumen.saldo)}
          </Text>

          <View style={styles.chipsRow}>
            <View style={styles.badge}>
              <View
                style={[styles.badgeDot, { backgroundColor: COLORS.income }]}
              />
              <Text style={styles.badgeText}>
                Ingresos {formatCurrency(resumen.ingresos)}
              </Text>
            </View>
            <View style={styles.badge}>
              <View
                style={[styles.badgeDot, { backgroundColor: COLORS.expense }]}
              />
              <Text style={styles.badgeText}>
                Gastos {formatCurrency(Math.abs(resumen.gastos))}
              </Text>
            </View>
          </View>
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
                {formatCurrency(resumen.ingresos - Math.abs(resumen.gastos))}
              </Text>
            </View>

            {/* Barra horizontal */}
            <View style={styles.flowBarBackground}>
              <View style={[styles.flowBarIngresos, { flex: fracIngresos }]} />
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

        {/* Si quisieras otra UI cuando esté "Metas de ahorro", aquí iría. */}
        {activeTopTab === 'savings' && (
          <View style={styles.flowCard}>
            <Text style={styles.flowTitle}>Progreso de tu meta de ahorro</Text>
            <Text style={[styles.flowAmount, { marginBottom: 12 }]}>
              $8,000.00 de $12,500.00
            </Text>

            <View style={styles.savingsBarBg}>
              <View style={styles.savingsBarFill} />
            </View>

            <View style={styles.savingsRow}>
              <View>
                <Text style={styles.savingsLabel}>Meta mensual</Text>
                <Text style={styles.savingsValue}>$12,500.00</Text>
              </View>
              <View>
                <Text style={styles.savingsLabel}>Ahorro acumulado</Text>
                <Text style={styles.savingsValue}>$8,000.00</Text>
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
                  name={acc.tipo === 'bank' ? 'card-outline' : 'wallet-outline'}
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

        {/* 🔹 NUEVO BLOQUE: RESUMEN DE MOVIMIENTOS */}
        <View style={styles.card}>
          {/* Título + recargar */}
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Resumen de movimientos</Text>
            <TouchableOpacity onPress={loadDashboard}>
              <Text style={styles.reloadText}>
                {loadingDashboard ? 'Cargando…' : 'Recargar'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tabs de periodo */}
          <View style={styles.periodTabsRow}>
            {[
              { key: 'hoy', label: 'Hoy' },
              { key: 'semana', label: 'Semana' },
              { key: 'mes', label: 'Mes' },
              { key: 'personalizado', label: 'Personalizado' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.periodTab,
                  activePeriod === tab.key && styles.periodTabActive,
                ]}
                onPress={() => setActivePeriod(tab.key as PeriodKey)}
              >
                <Text
                  style={[
                    styles.periodTabText,
                    activePeriod === tab.key && styles.periodTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Barra de búsqueda (solo visual por ahora) */}
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

          {/* Resumen de una categoría (inspirado en la imagen que mandaste) */}
          <View style={styles.categorySummaryRow}>
            <View style={styles.categoryLeft}>
              <View style={styles.categoryIconCircle}>
                <Ionicons
                  name="shirt-outline"
                  size={22}
                  color={COLORS.card}
                />
              </View>
              <View>
                <Text style={styles.categoryTitle}>Ropa</Text>
                <Text style={styles.categorySubtitle}>
                  $1,250 total este mes
                </Text>
              </View>
            </View>

            {/* mini gráfica circular estilizada */}
            <View style={styles.categoryPie}>
              <View style={styles.categoryPieLarge} />
              <View style={styles.categoryPieSmall} />
            </View>
          </View>

          {/* Dropdown de movimientos */}
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setShowMovements((prev) => !prev)}
          >
            <Text style={styles.dropdownLabel}>Movimientos</Text>
            <Ionicons
              name={showMovements ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          {showMovements && (
            <View style={{ marginTop: 4 }}>
              {loadingDashboard && (
                <ActivityIndicator
                  style={{ marginTop: 8 }}
                  color={COLORS.primary}
                />
              )}

              {!loadingDashboard &&
                movimientos.map((mov) => (
                  <View key={mov.id} style={styles.movItem}>
                    <View style={styles.movRow}>
                      {/* “Avatar” con inicial del comercio */}
                      <View style={styles.movAvatar}>
                        <Text style={styles.movAvatarText}>
                          {mov.descripcion.charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.movDescripcion}>
                          {mov.descripcion}
                        </Text>
                        <Text style={styles.movCategoria}>
                          {mov.categoria}
                        </Text>
                        <Text style={styles.movFecha}>{mov.fecha}</Text>
                      </View>

                      <Text
                        style={[
                          styles.movMonto,
                          mov.monto >= 0
                            ? styles.movMontoPositivo
                            : styles.movMontoNegativo,
                        ]}
                      >
                        {mov.monto >= 0
                          ? `+${formatCurrency(mov.monto)}`
                          : `-${formatCurrency(Math.abs(mov.monto))}`}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          )}
        </View>

        {/* Espacio para que el scroll no quede detrás del nav */}
        <View style={{ height: 120 }} />
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
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  // Card Saldo total
  netWorthCard: {
    backgroundColor: COLORS.card,
    borderRadius: 28,
    padding: 20,
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
    marginBottom: 16,
  },
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

  // Savings (para pestaña "Metas de ahorro")
  savingsBarBg: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 12,
  },
  savingsBarFill: {
    flex: 0.65, // 65% de la barra
    height: '100%',
    backgroundColor: COLORS.income,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  savingsLabel: {
    fontSize: 12,
    color: COLORS.muted,
  },
  savingsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
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
    marginBottom: 10,
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
  reloadText: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Tabs de periodo (Hoy / Semana / Mes / Personalizado)
  periodTabsRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 10,
    backgroundColor: '#edf1f5',
    borderRadius: 999,
    padding: 4,
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

  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf1f5',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 14,
  },
  searchBarPlaceholder: {
    fontSize: 13,
    color: COLORS.muted,
  },

  // Resumen de categoría + gráfica
  categorySummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  categorySubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  categoryPie: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  categoryPieLarge: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1f2b4f',
  },
  categoryPieSmall: {
    position: 'absolute',
    right: 4,
    top: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#9ca9c8',
  },

  // Dropdown movimientos
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  dropdownLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Movimientos
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
