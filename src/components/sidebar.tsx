import { Suspense } from "react";
import Link from "next/link";
import { House, Plus, Swords } from "lucide-react";

import { NewAccountForm } from "~/components/new-account-form";
import { getAllServers } from "~/server/db/queries";

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col border-r border-red-900/30 bg-black/40 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <Swords className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1
              className="text-xl tracking-wider uppercase font-bold font-teko text-el-red"
              style={{
                textShadow: "0 0 20px rgba(220,38,38,0.3)",
              }}
            >
              EL TRACKER
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500">
              Account Organizer
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded text-sm font-semibold transition-all hover:bg-red-900/20 hover:text-red-400 text-neutral-300 group"
          >
            <House className="w-4 h-4 text-red-500/60 group-hover:text-red-400 transition-colors" />
            Accueil
          </Link>
        </nav>

        <div className="my-6 h-px bg-linear-to-r from-transparent via-red-800/40 to-transparent" />

        <Suspense
          fallback={
            <button
              disabled
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded text-sm text-neutral-500 cursor-not-allowed"
            >
              <Plus className="w-4 h-4" /> Ajouter un compte
            </button>
          }
        >
          <NewAccountButton />
        </Suspense>
      </div>
    </aside>
  );
}

async function NewAccountButton() {
  const existingServers = await getAllServers();
  return <NewAccountForm existingServers={existingServers} />;
}
