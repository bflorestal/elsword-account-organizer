import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Shield, Zap } from "lucide-react";
import { SteamIcon } from "~/components/steam-icon";
import { getAllAccounts } from "~/server/db/queries";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="relative">
        <h1
          className="text-5xl sm:text-6xl tracking-wider uppercase font-bold font-teko text-el-red"
          style={{
            textShadow:
              "0 0 40px rgba(220,38,38,0.2), 0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Comptes
        </h1>
        <div
          className="absolute -bottom-2 left-0 h-0.5 w-24"
          style={{
            background:
              "linear-gradient(to right, #DC2626, #F59E0B, transparent)",
          }}
        />
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded border border-red-900/20 bg-red-950/10 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <AccountsList />
      </Suspense>
    </div>
  );
}

async function AccountsList() {
  const accountsList = await getAllAccounts();

  if (!accountsList || accountsList.length === 0) {
    return (
      <div
        className="text-center py-20 border border-dashed border-red-900/30 rounded-lg"
        style={{ background: "rgba(220,38,38,0.02)" }}
      >
        <Shield className="w-12 h-12 mx-auto text-red-900/40 mb-4" />
        <p className="text-neutral-500 text-sm">Aucun compte trouvé.</p>
        <p className="text-neutral-600 text-xs mt-1">
          Ajoutez un compte via la barre latérale.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {accountsList.map((acc, index) => (
        <div
          key={acc.id}
          className="group relative rounded-lg border border-red-900/20 transition-all duration-300 hover:border-red-700/40 hover:shadow-[0_0_30px_rgba(220,38,38,0.08)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(220,38,38,0.04) 0%, rgba(0,0,0,0.2) 100%)",
            clipPath:
              index % 2 === 0
                ? "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)"
                : "polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-50"
            style={{
              background: "linear-gradient(to right, #DC2626, transparent 60%)",
            }}
          />

          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center text-xl font-bold border border-red-800/30 font-teko text-el-red"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a0505 0%, #2a0a0a 100%)",
                  }}
                >
                  {acc.username.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    {acc.isSteam && (
                      <SteamIcon className="w-3.5 h-3.5 fill-neutral-400" />
                    )}
                    <Link
                      href={`/account/${acc.id}`}
                      className="font-semibold text-lg hover:text-red-400 transition-colors font-teko tracking-wide"
                    >
                      {acc.username}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
                      {acc.server.name}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-amber-500/80">
                      <Zap className="w-3 h-3" />
                      {acc.resonanceLevel}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/account/${acc.id}`}
                className="text-[10px] uppercase tracking-widest text-red-500/60 hover:text-red-400 transition-colors font-semibold"
              >
                Détails →
              </Link>
            </div>

            {acc.characters.length > 0 ? (
              <div className="grid gap-1.5">
                {acc.characters.map((char) => (
                  <Link
                    key={char.id}
                    href={`/character/${char.id}`}
                    className="flex items-center gap-3 px-3 py-2 rounded transition-all hover:bg-red-900/15 group/char"
                  >
                    <div className="relative">
                      <Image
                        src={char.specialization?.iconUrl ?? char.class.iconUrl}
                        alt={char.specialization?.name ?? char.class.name}
                        className="w-8 h-8 rounded"
                        width={40}
                        height={40}
                      />
                      {char.pvpRank?.iconUrl && (
                        <Image
                          src={char.pvpRank.iconUrl}
                          alt={char.pvpRank.name}
                          width={20}
                          height={20}
                          className="absolute -bottom-1 -right-1 w-4"
                        />
                      )}
                    </div>
                    <span className="text-sm font-medium text-neutral-300 group-hover/char:text-red-300 transition-colors">
                      {char.username}
                    </span>
                    <span className="text-[11px] text-neutral-600 ml-auto tabular-nums">
                      Niv. {char.level}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-neutral-600 text-xs italic pl-3">
                Aucun personnage
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
