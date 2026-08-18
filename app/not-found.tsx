import { ArrowLeft, Command } from "lucide-react";

export default function NotFound(){return <main className="auth-page"><a className="brand auth-brand" href="/"><span className="brand-mark"><Command size={16}/></span>ServiceFlow</a><section className="legal-page"><span className="technical orange">{"// ERROR 404"}</span><h1>Страница не найдена</h1><p>Такого адреса в ServiceFlow нет. Вернитесь на главную или откройте рабочее пространство.</p><a className="primary-button" href="/"><ArrowLeft/>На главную</a></section></main>}
