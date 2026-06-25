import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <section className="py-20 text-center">
        <span className="inline-flex items-center gap-1.5 bg-[#3b7a9e]/10 text-[#3b7a9e] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3b7a9e]" />
          Plataforma Financiera Corporativa
        </span>
        <h1 className="text-5xl font-bold text-slate-900 mb-5 leading-tight tracking-tight">
          Gestión de Préstamos<br />
          <span className="text-[#3b7a9e]">Moderna y Eficiente</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          SGIP permite simular, solicitar y monitorear préstamos en tiempo real con
          cronogramas de pago detallados y trazabilidad completa de transacciones.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/loans/simulate"
            className="bg-[#3b7a9e] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#2e6280] transition-colors shadow-sm"
          >
            Simular Préstamo
          </Link>
          <Link
            href="/loans"
            className="border border-slate-300 text-slate-700 font-semibold py-3 px-8 rounded-xl hover:border-[#3b7a9e] hover:text-[#3b7a9e] transition-colors"
          >
            Mis Préstamos
          </Link>
        </div>
      </section>

      <section className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/loans/simulate"
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#3b7a9e]/40 transition-all group"
        >
          <div className="w-12 h-12 bg-[#3b7a9e]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#3b7a9e] transition-colors">
            <svg
              className="w-6 h-6 text-[#3b7a9e] group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Simulador de Préstamos</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Calcula tu cuota mensual, cronograma completo e interés total antes de solicitar.
          </p>
        </Link>

        <Link
          href="/loans"
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 transition-colors">
            <svg
              className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Mis Préstamos</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Consulta el historial completo con estado, cronograma de pagos y detalle por préstamo.
          </p>
        </Link>

        <Link
          href="/transactions"
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all group"
        >
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-amber-600 transition-colors">
            <svg
              className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Historial de Transacciones</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Monitorea el flujo de pagos con badges de estado y registro de transacciones de prueba.
          </p>
        </Link>
      </section>
    </div>
  );
}
