import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the ServiceFlow landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>ServiceFlow — CRM для сервисного центра<\/title>/i);
  assert.match(html, /Каждый ремонт/);
  assert.match(html, /Открыть живое демо/);
  assert.match(html, /Попробовать/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("server-renders registration and login entry points", async () => {
  const [register, login, recovery] = await Promise.all([
    render("/register").then(response => response.text()),
    render("/login").then(response => response.text()),
    render("/forgot-password").then(response => response.text()),
  ]);
  assert.match(register, /Создайте аккаунт/);
  assert.match(register, /Повтор пароля/);
  assert.match(login, /Вход в ServiceFlow/);
  assert.match(login, /Запомнить меня/);
  assert.match(recovery, /Восстановление доступа/);
});

test("keeps auth, persistence, protection and CRUD logic isolated", async () => {
  const [auth, data, shell, orders, customers, landing] = await Promise.all([
    readFile(new URL("../lib/auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/crm-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/crm-shell.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/orders/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/customers/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(auth, /async register/);
  assert.match(auth, /async login/);
  assert.match(auth, /localStorage/);
  assert.match(auth, /sessionStorage/);
  assert.match(data, /saveOrders/);
  assert.match(data, /saveCustomers/);
  assert.match(shell, /window\.location\.replace\(`\/login/);
  assert.match(shell, /authService\.logout/);
  assert.match(orders, /onDragStart/);
  assert.match(orders, /onPointerUp/);
  assert.match(orders, /Удалить заказ/);
  assert.match(customers, /Создать клиента/);
  assert.match(landing, /window\.location\.assign\("\/register"\)/);
});
