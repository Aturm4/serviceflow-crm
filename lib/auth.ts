export type ServiceFlowUser = {
  id: string;
  name: string;
  company: string;
  email: string;
  createdAt: string;
};

type StoredUser = ServiceFlowUser & { passwordHash: string };

const USERS_KEY = "serviceflow:auth:users:v1";
const SESSION_KEY = "serviceflow:auth:session:v1";
const AUTH_EVENT = "serviceflow:auth-change";

function browserReady() {
  return typeof window !== "undefined";
}

function readUsers(): StoredUser[] {
  if (!browserReady()) return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as StoredUser[]; }
  catch { return []; }
}

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function persistSession(user: ServiceFlowUser, remember = true) {
  const target = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;
  target.setItem(SESSION_KEY, JSON.stringify(user));
  other.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export const authService = {
  async register(input: { name: string; company: string; email: string; password: string }) {
    const users = readUsers();
    const email = input.email.trim().toLowerCase();
    if (users.some(user => user.email === email)) throw new Error("Аккаунт с таким email уже существует");
    const user: StoredUser = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      company: input.company.trim(),
      email,
      passwordHash: await digest(input.password),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
    const { passwordHash: _passwordHash, ...sessionUser } = user;
    void _passwordHash;
    persistSession(sessionUser, true);
    return sessionUser;
  },

  async login(emailValue: string, password: string, remember = true) {
    const email = emailValue.trim().toLowerCase();
    const user = readUsers().find(candidate => candidate.email === email);
    if (!user || user.passwordHash !== await digest(password)) throw new Error("Неверный email или пароль");
    const { passwordHash: _passwordHash, ...sessionUser } = user;
    void _passwordHash;
    persistSession(sessionUser, remember);
    return sessionUser;
  },

  logout() {
    if (!browserReady()) return;
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
  },

  getSession(): ServiceFlowUser | null {
    if (!browserReady()) return null;
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as ServiceFlowUser; }
    catch { return null; }
  },

  hasAccount(emailValue: string) {
    return readUsers().some(user => user.email === emailValue.trim().toLowerCase());
  },

  subscribe(callback: () => void) {
    if (!browserReady()) return () => undefined;
    window.addEventListener(AUTH_EVENT, callback);
    window.addEventListener("storage", callback);
    return () => { window.removeEventListener(AUTH_EVENT, callback); window.removeEventListener("storage", callback); };
  },
};

