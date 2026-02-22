import Link from "next/link";
import { SearchX, Home } from "lucide-react";

export default function CharacterNotFound() {
  return (
    <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
      <div className="text-center max-w-md space-y-6">
        <div
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center border border-neutral-800"
          style={{
            background:
              "linear-gradient(135deg, rgba(115,115,115,0.1) 0%, rgba(115,115,115,0.03) 100%)",
          }}
        >
          <SearchX className="w-7 h-7 text-neutral-500" />
        </div>

        <div className="space-y-2">
          <h2
            className="text-3xl sm:text-4xl tracking-wider uppercase font-bold font-teko text-el-red"
            style={{ textShadow: "0 0 30px rgba(220,38,38,0.2)" }}
          >
            Personnage introuvable
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Ce personnage n&apos;existe pas ou a été supprimé.
          </p>
        </div>

        <div
          className="h-px w-24 mx-auto"
          style={{
            background:
              "linear-gradient(to right, transparent, #DC2626, #F59E0B, transparent)",
          }}
        />

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest rounded border border-red-900/40 text-red-400 transition-all duration-200 hover:border-red-700/60 hover:bg-red-900/15 hover:text-red-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(220,38,38,0.1) 0%, rgba(220,38,38,0.04) 100%)",
          }}
        >
          <Home className="w-3.5 h-3.5" />
          Retour aux comptes
        </Link>
      </div>
    </div>
  );
}
