"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md space-y-6">
        <div
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center border border-red-900/40"
          style={{
            background:
              "linear-gradient(135deg, rgba(220,38,38,0.12) 0%, rgba(220,38,38,0.04) 100%)",
          }}
        >
          <AlertTriangle className="w-7 h-7 text-red-500/80" />
        </div>

        <div className="space-y-2">
          <h2
            className="text-3xl sm:text-4xl tracking-wider uppercase font-bold font-teko text-el-red"
            style={{ textShadow: "0 0 30px rgba(220,38,38,0.2)" }}
          >
            Erreur
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Une erreur est survenue lors du chargement de cette page.
            <br />
            Veuillez réessayer ou revenir à l&apos;accueil.
          </p>
          {error.digest && (
            <p className="text-[10px] text-neutral-600 font-mono mt-2">
              Réf : {error.digest}
            </p>
          )}
        </div>

        <div
          className="h-px w-24 mx-auto"
          style={{
            background:
              "linear-gradient(to right, transparent, #DC2626, #F59E0B, transparent)",
          }}
        />

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest rounded border border-red-900/40 text-red-400 transition-all duration-200 hover:border-red-700/60 hover:bg-red-900/15 hover:text-red-300 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(220,38,38,0.1) 0%, rgba(220,38,38,0.04) 100%)",
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réessayer
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest rounded border border-neutral-800 text-neutral-400 transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-800/50 hover:text-neutral-300"
          >
            <Home className="w-3.5 h-3.5" />
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
