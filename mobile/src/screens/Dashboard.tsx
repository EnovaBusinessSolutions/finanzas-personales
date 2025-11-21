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

// 🎨 Paleta basada en tu referencia
const COLORS = {
  background: '#d3dedc', // gris verdoso suave
  card: '#fffffb',       // blanco cálido
  primary: '#0b1a3b',    // azul marino
  muted: '#7d8083',      // texto secundario
  chipBg: '#eef2f1',
  positive: '#00b894',   // verde ingresos
  negative: '#ff7a1a',   // naranja gastos
  border: '#d0d7d5',
  navBg: '#0b1a3b',
  navIconInactive: '#cbd5df',
};

// Formateador de moneda con comas y puntos
const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatSignedCurrency(value: number) {
  const abs = Math.abs(value);
  const formatted = currencyFormatter.format(abs);
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

export default function Dashboard() {
  const [health, setHealth] = useState<any | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Valores derivados (si aún no hay data, usamos defaults)
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

  // Cargar al montar la pantalla
  useEffect(() => {
    loadDashboard();
  }, []);

  // Para la barrita Ingresos vs Gastos
  const totalParaBarra = resumen.ingresos + resumen.gastos || 1; // evitar 0
  const fracIngresos = resumen.ingresos / totalParaBarra;
  const fracGastos = resumen.gastos / totalParaBarra;

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* === Card Saldo total === */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saldo total</Text>
          <Text style={styles.saldoTotalText}>{formatCurrency(resumen.saldo)}</Text>

          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <View style={[styles.chipDot, { backgroundColor: COLORS.positive }]} />
              <Text style={styles.chipText}>
                Ingresos {formatCurrency(resumen.ingresos)}
              </Text>
            </View>
            <View style={styles.chip}>
              <View style={[styles.chipDot, { backgroundColor: COLORS.negative }]} />
              <Text style={styles.chipText}>
                Gastos {formatCurrency(resumen.gastos)}
              </Text>
            </View>
          </View>
        </View>

        {/* === Card Presupuesto (barra verde) === */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Presupuesto</Text>

          <View style={styles.barWrapper}>
            <View style={styles.barBackground}>
              <View style={[styles.barIngresos, { flex: fracIngresos }]} />
              <View style={[styles.barGastos, { flex: fracGastos }]} />
            </View>
          </View>

          <View style={styles.presupuestoRow}>
            <View style={styles.presupuestoItem}>
              <Text style={styles.presupuestoLabel}>Ingresos</Text>
              <Text style={[styles.presupuestoValue, { color: COLORS.positive }]}>
                {formatCurrency(resumen.ingresos)}
              </Text>
            </View>
            <View style={styles.presupuestoItem}>
              <Text style={styles.presupuestoLabel}>Gastos</Text>
              <Text style={[styles.presupuestoValue, { color: COLORS.negative }]}>
                {formatCurrency(resumen.gastos)}
              </Text>
            </View>
          </View>
        </View>

        {/* === Respuesta de la API === */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Respuesta de la API</Text>
            <TouchableOpacity
              onPress={handleProbarApi}
              style={styles.apiButton}
              disabled={loadingHealth}
            >
              <Text style={styles.apiButtonText}>
                {loadingHealth ? 'Probando…' : 'Probar API'}
              </Text>
            </TouchableOpacity>
          </View>

          {loadingHealth && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 8 }} />}

          {!loadingHealth && health && (
            <Text style={styles.jsonText}>{JSON.stringify(health, null, 2)}</Text>
          )}

          {!loadingHealth && !health && (
            <Text style={styles.mutedText}>
              Pulsa "Probar API" para ver la respuesta.
            </Text>
          )}
        </View>

        {/* Errores */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* === Últimos movimientos === */}
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
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 8 }} />
          )}

          {!loadingDashboard &&
            movimientos.map((mov) => (
              <View key={mov.id} style={styles.movimientoCard}>
                <View style={styles.movHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.movDescripcion}>{mov.descripcion}</Text>
                    <Text style={styles.movFecha}>{mov.fecha}</Text>
                  </View>
                  <Text
                    style={[
                      styles.movMonto,
                      mov.monto >= 0 ? styles.montoPositivo : styles.montoNegativo,
                    ]}
                  >
                    {formatSignedCurrency(mov.monto)}
                  </Text>
                </View>
                <Text style={styles.movCategoria}>{mov.categoria}</Text>
              </View>
            ))}
        </View>
      </ScrollView>

      {/* === Bottom Navigation estilo app de finanzas === */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, styles.navIconActive]}>🏠</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Reportes</Text>
        </TouchableOpacity>

        <View style={styles.navPlusWrapper}>
          <TouchableOpacity style={styles.navPlusCircle}>
            <Text style={styles.navPlusText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🎯</Text>
          <Text style={styles.navLabel}>Metas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Ajustes</Text>
        </TouchableOpacity>
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
    paddingBottom: 120, // espacio para que no se tape con la nav
  },

  // Cards generales
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },

  // Saldo total
  saldoTotalText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 16,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: COLORS.chipBg,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 6,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Presupuesto
  barWrapper: {
    marginBottom: 12,
  },
  barBackground: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
  },
  barIngresos: {
    backgroundColor: COLORS.positive,
  },
  barGastos: {
    backgroundColor: COLORS.negative,
  },
  presupuestoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  presupuestoItem: {
    flex: 1,
  },
  presupuestoLabel: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 2,
  },
  presupuestoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // API card
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apiButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  apiButtonText: {
    color: COLORS.card,
    fontSize: 13,
    fontWeight: '600',
  },
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
  mutedText: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 4,
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  smallLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },

  // Movimientos
  movimientoCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  movHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
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
    marginTop: 6,
  },
  movMonto: {
    fontSize: 16,
    fontWeight: '700',
  },
  montoPositivo: {
    color: COLORS.positive,
  },
  montoNegativo: {
    color: COLORS.negative,
  },

  // Bottom nav
  navBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    height: 72,
    backgroundColor: COLORS.navBg,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 20,
    color: COLORS.navIconInactive,
    marginBottom: 2,
  },
  navIconActive: {
    color: '#ffffff',
  },
  navLabel: {
    fontSize: 11,
    color: COLORS.navIconInactive,
  },
  navLabelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  navPlusWrapper: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  navPlusCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  navPlusText: {
    color: COLORS.navBg,
    fontSize: 28,
    fontWeight: '700',
    marginTop: -2,
  },
});
