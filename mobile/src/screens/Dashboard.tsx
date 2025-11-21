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

// Helper para formatear cantidades
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

type TabKey = 'home' | 'reports' | 'goals' | 'settings';

export default function Dashboard() {
  const [health, setHealth] = useState<any | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const resumen = dashboard?.resumen ?? { ingresos: 0, gastos: 0, saldo: 0 };
  const movimientos = dashboard?.movimientos ?? [];

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
        {/* Card: Saldo total */}
        <View style={styles.cardBalance}>
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

        {/* Card: Presupuesto */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Presupuesto</Text>

          {/* Barra verde */}
          <View style={styles.budgetBarBackground}>
            <View style={styles.budgetBarFill} />
            <View style={styles.budgetBarCap} />
          </View>

          <View style={styles.budgetRow}>
            <View style={styles.budgetColumn}>
              <Text style={styles.budgetLabel}>Ingresos</Text>
              <Text style={[styles.budgetValue, { color: COLORS.income }]}>
                {formatCurrency(resumen.ingresos)}
              </Text>
            </View>
            <View style={styles.budgetColumn}>
              <Text style={styles.budgetLabel}>Gastos</Text>
              <Text style={[styles.budgetValue, { color: COLORS.expense }]}>
                {formatCurrency(Math.abs(resumen.gastos))}
              </Text>
            </View>
          </View>
        </View>

        {/* Card: Respuesta API */}
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

        {/* Errores */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Card: Movimientos */}
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

        {/* Espacio para que el scroll no quede debajo del nav */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.navBarContainer}>
        <View style={styles.navBar}>
          {/* Inicio */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('home')}
          >
            <Ionicons
              name={activeTab === 'home' ? 'home' : 'home-outline'}
              size={22}
              color={
                activeTab === 'home'
                  ? COLORS.navIconActive
                  : COLORS.navIconInactive
              }
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'home' && styles.navLabelActive,
              ]}
            >
              Inicio
            </Text>
          </TouchableOpacity>

          {/* Reportes */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('reports')}
          >
            <Ionicons
              name={
                activeTab === 'reports' ? 'bar-chart' : 'bar-chart-outline'
              }
              size={22}
              color={
                activeTab === 'reports'
                  ? COLORS.navIconActive
                  : COLORS.navIconInactive
              }
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'reports' && styles.navLabelActive,
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
            onPress={() => setActiveTab('goals')}
          >
            <Ionicons
              name={activeTab === 'goals' ? 'flag' : 'flag-outline'}
              size={22}
              color={
                activeTab === 'goals'
                  ? COLORS.navIconActive
                  : COLORS.navIconInactive
              }
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'goals' && styles.navLabelActive,
              ]}
            >
              Metas
            </Text>
          </TouchableOpacity>

          {/* Ajustes */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('settings')}
          >
            <Ionicons
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
              size={22}
              color={
                activeTab === 'settings'
                  ? COLORS.navIconActive
                  : COLORS.navIconInactive
              }
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'settings' && styles.navLabelActive,
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

  // Tarjetas
  cardBalance: {
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
    gap: 12,
    flexWrap: 'wrap',
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

  // Presupuesto
  budgetBarBackground: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#d1e5d5',
    overflow: 'hidden',
    marginBottom: 16,
  },
  budgetBarFill: {
    flex: 1,
    backgroundColor: COLORS.income,
  },
  budgetBarCap: {
    position: 'absolute',
    right: 4,
    top: 1.5,
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#059669',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetColumn: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 2,
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
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
