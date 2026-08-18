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
  try {
    const value = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(value) ? value.filter((user): user is StoredUser => Boolean(user && typeof user.id === "string" && typeof user.email === "string" && typeof user.passwordHash === "string")) : [];
  }
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

  async resetPassword(emailValue: string, password: string) {
    const email = emailValue.trim().toLowerCase();
    const users = readUsers();
    const index = users.findIndex(user => user.email === email);
    if (index < 0) throw new Error("Аккаунт с таким email не найден");
    users[index] = { ...users[index], passwordHash: await digest(password) };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
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
    try {
      const value = JSON.parse(raw) as Partial<ServiceFlowUser>;
      if (!value || typeof value.id !== "string" || typeof value.name !== "string" || typeof value.company !== "string" || typeof value.email !== "string") throw new Error("invalid session");
      return value as ServiceFlowUser;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  hasAccount(emailValue: string) {
    return readUsers().some(user => user.email === emailValue.trim().toLowerCase());
  },

  updateProfile(patch: Pick<ServiceFlowUser, "company" | "email">) {
    const session = this.getSession();
    if (!session) return null;
    const email = patch.email.trim().toLowerCase();
    const users = readUsers();
    if (users.some(user => user.id !== session.id && user.email === email)) throw new Error("Этот email уже используется другим аккаунтом");
    const next = { ...session, company: patch.company.trim(), email };
    localStorage.setItem(USERS_KEY, JSON.stringify(users.map(user => user.id === session.id ? { ...user, company: next.company, email: next.email } : user)));
    persistSession(next, Boolean(localStorage.getItem(SESSION_KEY)));
    return next;
  },

  subscribe(callback: () => void) {
    if (!browserReady()) return () => undefined;
    window.addEventListener(AUTH_EVENT, callback);
    window.addEventListener("storage", callback);
    return () => { window.removeEventListener(AUTH_EVENT, callback); window.removeEventListener("storage", callback); };
  },
};
