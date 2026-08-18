import Link from "next/link";
import { ArrowLeft, Command } from "lucide-react";

export default function NotFound(){return <main className="auth-page"><Link className="brand auth-brand" href="/"><span className="brand-mark"><Command size={16}/></span>ServiceFlow</Link><section className="legal-page"><span className="technical orange">{"// ERROR 404"}</span><h1>Страница не найдена</h1><p>Такого адреса в ServiceFlow нет. Вернитесь на главную или откройте рабочее пространство.</p><Link className="primary-button" href="/"><ArrowLeft/>На главную</Link></section></main>}
