// mobile/src/services/api.ts
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};
const API_URL = extra.API_URL as string | undefined;

if (!API_URL) {
  console.warn('⚠️ API_URL no está configurado en app.json');
}

export async function testApi() {
  if (!API_URL) {
    throw new Error('API_URL no está configurado');
  }

  const res = await fetch(`${API_URL}/health`);

  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status}`);
  }

  const data = await res.json();
  return data;
}

export async function getMovimientosDemo() {
  if (!API_URL) {
    throw new Error('API_URL no está configurado');
  }

  const res = await fetch(`${API_URL}/movimientos-demo`);

  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status}`);
  }

  const json = await res.json();

  // json = { ok: true, data: [...] }
  return json.data as Array<{
    id: number;
    fecha: string;
    descripcion: string;
    categoria: string;
    monto: number;
  }>;
}

export async function getDashboardDemo() {
  if (!API_URL) {
    throw new Error('API_URL no está configurado');
  }

  const res = await fetch(`${API_URL}/dashboard-demo`);

  if (!res.ok) {
    throw new Error(`Error HTTP ${res.status}`);
  }

  const json = await res.json();

  // json = { ok, resumen, movimientos }
  return json as {
    ok: boolean;
    resumen: {
      ingresos: number;
      gastos: number;
      saldo: number;
    };
    movimientos: Array<{
      id: number;
      fecha: string;
      descripcion: string;
      categoria: string;
      monto: number;
    }>;
  };
}
