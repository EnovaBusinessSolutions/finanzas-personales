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
  ok?: boolean; // opcional, por si el backend lo manda
  resumen: {
    ingresos: number;
    gastos: number;
    saldo: number;
  };
  movimientos: Movimiento[];
};

// Paleta basada en tu diseño:
// #0b1a3b (azul marino), #d3dedc (fondo), #fffffb (cards), #7d8083 (muted)
const COLORS = {
  background: '#d3dedc',
  card: '#fffffb',
  cardSoft: '#fffffb',
  accent: '#0b1a3b',
  accentSoft: '#0b1a3b',
  text: '#0b1a3b',
  muted: '#7d8083',
  border: '#c4cfcd',
  // extras para números
  positive: '#0b8f55',
  negative: '#c0392b',
};

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
  const totalParaBarra =
    resumen.ingresos + Math.abs(resumen.gastos) || 1; // evitar división por 0
  const fracIngresos = resumen.ingresos / totalParaBarra;
  const fracGastos = Math.abs(resumen.gastos) / totalParaBarra;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={handleProbarApi}>
          <Text style={styles.link}>
            {loadingHealth ? 'Probando…' : 'Probar API'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Resumen rápido */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen rápido</Text>
        <View style={styles.resumenRow}>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenLabel}>Ingresos</Text>
            <Text style={[styles.resumenValue, styles.positivo]}>
              ${resumen.ingresos.toFixed(2)}
            </Text>
          </View>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenLabel}>Gastos</Text>
            <Text style={[styles.resumenValue, styles.negativo]}>
              ${resumen.gastos.toFixed(2)}
            </Text>
          </View>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenLabel}>Saldo</Text>
            <Text style={[styles.resumenValue, styles.positivo]}>
              ${resumen.saldo.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Barrita Ingresos vs Gastos */}
        <View style={styles.barWrapper}>
          <View style={styles.barBackground}>
            <View style={[styles.barIngresos, { flex: fracIngresos }]} />
            <View style={[styles.barGastos, { flex: fracGastos }]} />
          </View>
          <View style={styles.barLegendRow}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: COLORS.positive }]}
              />
              <Text style={styles.legendText}>Ingresos</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: COLORS.negative }]}
              />
              <Text style={styles.legendText}>Gastos</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Respuesta de /health */}
      <View style={styles.cardSoft}>
        <Text style={styles.cardTitle}>Respuesta de la API</Text>
        {loadingHealth && <ActivityIndicator color={COLORS.accent} />}
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

      {/* Lista de movimientos */}
      <View style={styles.cardSoft}>
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
            color={COLORS.accent}
            style={{ marginTop: 8 }}
          />
        )}

        {!loadingDashboard &&
          movimientos.map((mov) => (
            <View key={mov.id} style={styles.movimientoCard}>
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
                      ? styles.montoPositivo
                      : styles.montoNegativo,
                  ]}
                >
                  {mov.monto >= 0 ? `+${mov.monto}` : mov.monto}
                </Text>
              </View>
              <Text style={styles.movCategoria}>{mov.categoria}</Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
  },
  link: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardSoft: {
    backgroundColor: COLORS.cardSoft,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: COLORS.text,
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  resumenItem: {
    flex: 1,
    marginRight: 8,
  },
  resumenLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 4,
  },
  resumenValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  positivo: {
    color: COLORS.positive,
  },
  negativo: {
    color: COLORS.negative,
  },
  barWrapper: {
    marginTop: 16,
  },
  barBackground: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#c2cec9',
  },
  barIngresos: {
    backgroundColor: COLORS.positive,
  },
  barGastos: {
    backgroundColor: COLORS.negative,
  },
  barLegendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.muted,
  },
  jsonText: {
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'Courier',
    }),
    fontSize: 12,
    color: COLORS.text,
    marginTop: 8,
  },
  muted: {
    color: COLORS.muted,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.negative,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallLink: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '500',
  },
  movimientoCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  movHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  movDescripcion: {
    color: COLORS.text,
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
});
