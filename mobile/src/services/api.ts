// mobile/src/services/api.ts
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};
const API_URL = (extra.API_URL as string | undefined)?.replace(/\/+$/, ''); // quitamos / final por si acaso

if (!API_URL) {
  console.warn('⚠️ API_URL no está configurado en app.json');
}

// --- Helper general para hacer requests JSON ---
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error('API_URL no está configurado');
  }

  const url = `${API_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // puede que no venga JSON; lo ignoramos
  }

  if (!res.ok) {
    const message =
      body?.message ||
      body?.error ||
      `Error HTTP ${res.status} al llamar a ${path}`;
    throw new Error(message);
  }

  return body as T;
}

// =====================
//      TIPOS
// =====================

export type MovimientoDemo = {
  id: number;
  fecha: string;
  descripcion: string;
  categoria: string;
  monto: number;
};

export type DashboardDemoResponse = {
  ok: boolean;
  resumen: {
    ingresos: number;
    gastos: number;
    saldo: number;
  };
  movimientos: MovimientoDemo[];
};

export type AuthUser = {
  id: string;
  email: string;
  phone?: string;
  createdAt: string;
};

// =====================
//   ENDPOINTS EXISTENTES
// =====================

export async function testApi() {
  // GET /health
  return request<{ ok: boolean }>('/health');
}

export async function getMovimientosDemo() {
  // GET /movimientos-demo
  const json = await request<{ ok: boolean; data: MovimientoDemo[] }>(
    '/movimientos-demo'
  );
  return json.data;
}

export async function getDashboardDemo() {
  // GET /dashboard-demo
  const json = await request<DashboardDemoResponse>('/dashboard-demo');
  return json;
}

// =====================
//   AUTENTICACIÓN
// =====================

// POST /api/auth/register
export async function registerUser(input: {
  email: string;
  password: string;
  phone: string;
}): Promise<AuthUser> {
  const body = await request<AuthUser>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return body;
}

// POST /api/auth/login
export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const body = await request<AuthUser>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return body;
}
