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

// Paleta basada en la imagen 2
const COLORS = {
  primary: '#0b1a3b', // azul oscuro
  background: '#d3dedc', // gris verdoso claro
  card: '#fffffb', // casi blanco
  muted: '#7d8083',
  borderSoft: 'rgba(11, 26, 59, 0.08)',
  income: '#16a34a', // verde para ingresos
  expense: '#f97316', // naranja para gastos
};

export default function Dashboard() {
  const [health, setHealth] = useState<any | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resumen = dashboard?.resumen ?? { ingresos: 0, gastos: 0, saldo: 0 };
  const movimientos = dashboard?.movimientos ?? [];

  // 👉 Botón "Probar API"
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

  // 👉 Cargar dashboard
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

  // Para la barra de presupuesto
  const totalBarra = resumen.ingresos + Math.abs(resumen.gastos) || 1;
  const fracIngresos = resumen.ingresos / totalBarra;
  const fracGastos = Math.abs(resumen.gastos) / totalBarra;

  const saldoFormateado = `$${resumen.saldo.toFixed(2)}`;
  const ingresosFormateados = `$${resumen.ingresos.toFixed(2)}`;
  const gastosFormateados = `$${Math.abs(resumen.gastos).toFixed(2)}`;

  return (
    <View style={styles.container}>
      {/* CONTENIDO SCROLLABLE */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity onPress={handleProbarApi}>
            <Text style={styles.link}>
              {loadingHealth ? 'Probando…' : 'Probar API'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card Saldo total (tipo imagen 3) */}
        <View style={styles.balanceCard}>
          <Text style={styles.cardLabel}>Saldo total</Text>
          <Text style={styles.balanceAmount}>{saldoFormateado}</Text>

          <View style={styles.balanceRow}>
            <View style={styles.balancePill}>
              <View
                style={[styles.pillDot, { backgroundColor: COLORS.income }]}
              />
              <Text style={styles.pillText}>Ingresos {ingresosFormateados}</Text>
            </View>
            <View style={styles.balancePill}>
              <View
                style={[styles.pillDot, { backgroundColor: COLORS.expense }]}
              />
              <Text style={styles.pillText}>Gastos {gastosFormateados}</Text>
            </View>
          </View>
        </View>

        {/* Card Presupuesto (barra ingresos vs gastos) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Presupuesto</Text>
          <View style={styles.budgetBarBackground}>
            <View
              style={[
                styles.budgetSegmentIncome,
                { flex: fracIngresos },
              ]}
            />
            <View
              style={[
                styles.budgetSegmentExpense,
                { flex: fracGastos },
              ]}
            />
          </View>

          <View style={styles.budgetRow}>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Ingresos</Text>
              <Text style={[styles.budgetValue, { color: COLORS.income }]}>
                {ingresosFormateados}
              </Text>
            </View>
            <View style={styles.budgetItem}>
              <Text style={styles.budgetLabel}>Gastos</Text>
              <Text style={[styles.budgetValue, { color: COLORS.expense }]}>
                {gastosFormateados}
              </Text>
            </View>
          </View>
        </View>

        {/* Card Respuesta API (debug/tecnica) */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Respuesta de la API</Text>
          </View>
          {loadingHealth && <ActivityIndicator color={COLORS.primary} />}
          {!loadingHealth && health && (
            <Text style={styles.jsonText}>
              {JSON.stringify(health, null, 2)}
            </Text>
          )}
          {!loadingHealth && !health && (
            <Text style={styles.muted}>
              Pulsa "Probar API" para ver la respuesta.
            </Text>
          )}
        </View>

        {/* Errores */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Card Últimos movimientos */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Últimos movimientos</Text>
            <TouchableOpacity onPress={loadDashboard}>
              <Text style={styles.smallLink}>
                {loadingDashboard ? 'Cargando…' : 'Recargar'}
              </Text>
            </TouchableOpacity>
          </View>

          {loadingDashboard && (
            <ActivityIndicator
              color={COLORS.primary}
              style={{ marginTop: 8 }}
            />
          )}

          {!loadingDashboard &&
            movimientos.map((mov) => (
              <View key={mov.id} style={styles.movimientoRow}>
                <View style={styles.movLeft}>
                  <Text style={styles.movDescripcion}>{mov.descripcion}</Text>
                  <Text style={styles.movFecha}>{mov.fecha}</Text>
                  <Text style={styles.movCategoria}>{mov.categoria}</Text>
                </View>
                <Text
                  style={[
                    styles.movMonto,
                    mov.monto >= 0
                      ? styles.montoPositivo
                      : styles.montoNegativo,
                  ]}
                >
                  {mov.monto >= 0 ? `+${mov.monto}` : mov.monto}
                </Text>
              </View>
            ))}
        </View>
      </ScrollView>

      {/* MENÚ INFERIOR MOCK (como imagen 3) */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <View style={styles.navIconActive} />
          <Text style={styles.navLabelActive}>Inicio</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>Reportes</Text>
        </View>
        <View style={styles.navItemCenter}>
          <View style={styles.navPlusCircle}>
            <Text style={styles.navPlusText}>+</Text>
          </View>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>Metas</Text>
        </View>
        <View style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>Ajustes</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Layout general
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110, // espacio para el bottom nav
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
  },
  link: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  // Cards base
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: COLORS.primary,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.muted,
  },

  // Card Saldo total
  balanceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 26,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 6,
    marginBottom: 14,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2f7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 6,
  },
  pillText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },

  // Presupuesto
  budgetBarBackground: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
  },
  budgetSegmentIncome: {
    backgroundColor: COLORS.income,
  },
  budgetSegmentExpense: {
    backgroundColor: COLORS.expense,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetItem: {
    flex: 1,
    marginRight: 12,
  },
  budgetLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 2,
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // API / texto
  jsonText: {
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'Courier',
    }),
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 8,
  },
  muted: {
    color: COLORS.muted,
    fontSize: 14,
  },
  errorText: {
    color: '#b91c1c',
    marginHorizontal: 20,
    marginBottom: 8,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallLink: {
    color: COLORS.primary,
    fontSize: 14,
  },

  // Movimientos
  movimientoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  movLeft: {
    flex: 1,
    paddingRight: 8,
  },
  movDescripcion: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  movFecha: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 2,
  },
  movCategoria: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  movMonto: {
    fontSize: 16,
    fontWeight: '700',
  },
  montoPositivo: {
    color: COLORS.income,
  },
  montoNegativo: {
    color: COLORS.expense,
  },

  // Bottom nav (mock)
  bottomNav: {
    height: 70,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSoft,
    backgroundColor: COLORS.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.muted,
    marginBottom: 2,
  },
  navIconActive: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    marginBottom: 2,
    backgroundColor: 'rgba(11, 26, 59, 0.08)',
  },
  navLabel: {
    fontSize: 11,
    color: COLORS.muted,
  },
  navLabelActive: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  navPlusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  navPlusText: {
    color: COLORS.card,
    fontSize: 24,
    fontWeight: '700',
    marginTop: -2,
  },
});
