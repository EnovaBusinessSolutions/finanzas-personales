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
import { testApi, getDashboardDemo } from '../services/api';

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

export default function Dashboard() {
  const [health, setHealth] = useState<any | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeBottomTab, setActiveBottomTab] =
    useState<BottomTabKey>('home');
  const [activeTopTab, setActiveTopTab] = useState<TopTabKey>('balance');

  const resumen = dashboard?.resumen ?? { ingresos: 0, gastos: 0, saldo: 0 };
  const movimientos = dashboard?.movimientos ?? [];

  // Para barra ingresos vs gastos
  const totalBar = resumen.ingresos + Math.abs(resumen.gastos) || 1;
  const fracIngresos = resumen.ingresos / totalBar;
  const fracGastos = Math.abs(resumen.gastos) / totalBar;

  // 👉 Botón "Probar API" (usa /health)
  async function handleProbarApi() {
    try {
      setLoadingHealth(true);
      setError(null);
      const data = await testApi();
      setHealth(data);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? 'Error probando API');
    } finally {
      setLoadingHealth(false);
    }
  }

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
        {/* HEADER tipo "FinaFlow" */}
        <View style={styles.headerRow}>
          <Ionicons name="close" size={22} color={COLORS.muted} />
          <Text style={styles.appTitle}>FinaFlow</Text>
          <Ionicons
            name="person-circle-outline"
            size={26}
            color={COLORS.primary}
          />
        </View>

        {/* PATRIMONIO NETO (círculo grande) */}
        <View style={styles.netWorthCard}>
          <View style={styles.netWorthCircleOuter}>
            <View style={styles.netWorthCircleInner}>
              <Text style={styles.netWorthLabel}>Patrimonio neto</Text>
              <Text style={styles.netWorthValue}>
                {formatCurrency(resumen.saldo)}
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

        {/* BLOQUE PRINCIPAL Ingresos vs Gastos (barra horizontal) */}
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
                <Text style={styles.flowStatValue}>
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
                <Text style={styles.flowStatValue}>
                  {formatCurrency(Math.abs(resumen.gastos))}
                </Text>
              </View>
            </View>
          </View>
        </View>

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

        {/* RESPUESTA API (para debug / pruebas) */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Respuesta de la API</Text>
            <TouchableOpacity
              onPress={handleProbarApi}
              style={styles.apiChipButton}
            >
              {loadingHealth ? (
                <ActivityIndicator size="small" color={COLORS.apiChipText} />
              ) : (
                <Text style={styles.apiChipText}>Probar API</Text>
              )}
            </TouchableOpacity>
          </View>

          {!loadingHealth && health && (
            <Text style={styles.apiJsonText}>
              {JSON.stringify(health, null, 2)}
            </Text>
          )}

          {!loadingHealth && !health && (
            <Text style={styles.mutedText}>
              Pulsa "Probar API" para ver la respuesta.
            </Text>
          )}
        </View>

        {/* ERRORES */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* ÚLTIMOS MOVIMIENTOS (con datos reales del backend) */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Últimos movimientos</Text>
            <TouchableOpacity onPress={loadDashboard}>
              <Text style={styles.reloadText}>
                {loadingDashboard ? 'Cargando…' : 'Recargar'}
              </Text>
            </TouchableOpacity>
          </View>

          {loadingDashboard && (
            <ActivityIndicator
              style={{ marginTop: 8 }}
              color={COLORS.primary}
            />
          )}

          {!loadingDashboard &&
            movimientos.map((mov) => (
              <View key={mov.id} style={styles.movItem}>
                <View style={styles.movHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.movDescripcion}>
                      {mov.descripcion}
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
                <Text style={styles.movCategoria}>{mov.categoria}</Text>
              </View>
            ))}
        </View>

        {/* Espacio para que el scroll no quede detrás del nav */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Nav (igual que tenías, sólo usando iconos válidos) */}
      <View style={styles.navBarContainer}>
        <View style={styles.navBar}>
          {/* Inicio */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveBottomTab('home')}
          >
            <Ionicons
              name={
                activeBottomTab === 'home' ? 'home' : 'home-outline'
              }
              size={22}
              color={
                activeBottomTab === 'home'
                  ? COLORS.navIconActive
                  : COLORS.navIconInactive
              }
            />
            <Text
              style={[
                styles.navLabel,
                activeBottomTab === 'home' && styles.navLabelActive,
              ]}
            >
              Inicio
            </Text>
          </TouchableOpacity>

          {/* Reportes */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveBottomTab('reports')}
          >
            <Ionicons
              name={
                activeBottomTab === 'reports'
                  ? 'stats-chart'
                  : 'stats-chart-outline'
              }
              size={22}
              color={
                activeBottomTab === 'reports'
                  ? COLORS.navIconActive
                  : COLORS.navIconInactive
              }
            />
            <Text
              style={[
                styles.navLabel,
                activeBottomTab === 'reports' && styles.navLabelActive,
              ]}
            >
              Reportes
            </Text>
          </TouchableOpacity>

          {/* Botón central (+) */}
          <View style={styles.navPlusWrapper}>
            <TouchableOpacity style={styles.navPlusCircle}>
              <Ionicons name="add" size={30} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Metas */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveBottomTab('goals')}
          >
            <Ionicons
              name={
                activeBottomTab === 'goals' ? 'flag' : 'flag-outline'
              }
              size={22}
              color={
                activeBottomTab === 'goals'
                  ? COLORS.navIconActive
                  : COLORS.navIconInactive
              }
            />
            <Text
              style={[
                styles.navLabel,
                activeBottomTab === 'goals' && styles.navLabelActive,
              ]}
            >
              Metas
            </Text>
          </TouchableOpacity>

          {/* Ajustes */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveBottomTab('settings')}
          >
            <Ionicons
              name={
                activeBottomTab === 'settings'
                  ? 'settings'
                  : 'settings-outline'
              }
              size={22}
              color={
                activeBottomTab === 'settings'
                  ? COLORS.navIconActive
                  : COLORS.navIconInactive
              }
            />
            <Text
              style={[
                styles.navLabel,
                activeBottomTab === 'settings' &&
                  styles.navLabelActive,
              ]}
            >
              Ajustes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Patrimonio neto
  netWorthCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  netWorthCircleOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 12,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  netWorthCircleInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  netWorthLabel: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 4,
  },
  netWorthValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
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
    backgroundColor: '#facc15',
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

  // Card genérica (API, movimientos)
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

  // API
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apiChipButton: {
    backgroundColor: COLORS.apiChipBg,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  apiChipText: {
    color: COLORS.apiChipText,
    fontWeight: '700',
    fontSize: 14,
  },
  apiJsonText: {
    marginTop: 10,
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'Courier',
    }),
    fontSize: 12,
    color: COLORS.text,
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

  // Movimientos
  movItem: {
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
  },
  movHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  movDescripcion: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  movFecha: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  movCategoria: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
  },
  movMonto: {
    fontSize: 16,
    fontWeight: '700',
  },
  movMontoPositivo: {
    color: COLORS.income,
  },
  movMontoNegativo: {
    color: COLORS.expense,
  },

  // Bottom nav
  navBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: COLORS.navBg,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11,
    marginTop: 4,
    color: COLORS.navLabelInactive,
  },
  navLabelActive: {
    color: COLORS.navLabelActive,
    fontWeight: '600',
  },
  navPlusWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
  },
  navPlusCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
