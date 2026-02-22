import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Plus, Server, Users, Zap } from "lucide-react";

import { Breadcrumb } from "~/components/breadcrumb";
import { SteamIcon } from "~/components/steam-icon";
import { DeleteAccountButton } from "./delete-account-button";
import { NewCharacterForm } from "./new-character-form";
import {
  getAccountById,
  getAllAccounts,
  getAllClasses,
  getAllPvPRanks,
  getAllSpecializations,
} from "~/server/db/queries";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: accountId } = await params;
  const parsedAccountId = parseInt(accountId);

  if (isNaN(parsedAccountId)) {
    notFound();
  }

  const account = await getAccountById(parsedAccountId);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumb
        items={[{ label: "Comptes", href: "/" }, { label: account.username }]}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 flex items-center justify-center text-2xl font-bold border border-red-800/40 font-teko text-el-red"
            style={{
              background: "linear-gradient(135deg, #1a0505 0%, #2a0a0a 100%)",
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            {account.username.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              {account.isSteam && (
                <SteamIcon className="w-5 h-5 fill-neutral-400" />
              )}
              <h1
                className="text-3xl sm:text-5xl tracking-wider font-bold font-teko text-el-red"
                style={{
                  textShadow: "0 0 30px rgba(220,38,38,0.2)",
                }}
              >
                {account.username}
              </h1>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Server className="w-3.5 h-3.5 text-neutral-500" />
                {account.server.name}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-amber-500/80">
                <Zap className="w-3.5 h-3.5" />
                Résonance {account.resonanceLevel}
              </span>
            </div>
          </div>
        </div>

        <DeleteAccountButton accountId={parsedAccountId} />
      </div>

      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(to right, #DC2626, #F59E0B 30%, transparent 70%)",
        }}
      />

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-red-500/60" />
            <h2 className="text-2xl uppercase tracking-wider font-bold font-teko text-neutral-200">
              Personnages
            </h2>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold text-el-red bg-el-red/15 border border-el-red/30">
              {account.characters.length}
            </span>
          </div>

          <Suspense
            fallback={
              <button
                disabled
                className="flex items-center gap-2 text-sm text-neutral-500 cursor-not-allowed"
              >
                <Plus className="w-4 h-4" /> Créer
              </button>
            }
          >
            <NewCharacterButton accountId={parsedAccountId} />
          </Suspense>
        </div>

        {account.characters.length > 0 ? (
          <div className="grid gap-3">
            {account.characters.map((char) => (
              <Link
                key={char.id}
                href={`/character/${char.id}`}
                className="group flex items-center gap-4 p-4 rounded-lg border border-red-900/20 transition-all duration-200 hover:border-red-700/40 hover:bg-red-950/20 hover:shadow-[0_0_25px_rgba(220,38,38,0.06)]"
                style={{
                  background: "rgba(220,38,38,0.03)",
                }}
              >
                <div className="relative shrink-0">
                  <Image
                    src={char.specialization?.iconUrl ?? char.class.iconUrl}
                    alt={char.specialization?.name ?? char.class.name}
                    className="w-10 h-10 rounded"
                    width={40}
                    height={40}
                  />
                  {char.pvpRank?.iconUrl && (
                    <Image
                      src={char.pvpRank.iconUrl}
                      alt={char.pvpRank.name}
                      width={24}
                      height={24}
                      className="absolute -bottom-1 -right-1 w-5"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-200 group-hover:text-red-300 transition-colors">
                    {char.username}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    {char.specialization?.name ?? char.class.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 tabular-nums">
                    Niv. {char.level}
                  </span>
                  <span className="text-red-600/40 group-hover:text-red-400 transition-colors text-xs">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-12 border border-dashed border-red-900/20 rounded-lg"
            style={{ background: "rgba(220,38,38,0.02)" }}
          >
            <p className="text-neutral-500 text-sm">Aucun personnage trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}

async function NewCharacterButton({ accountId }: { accountId: number }) {
  const existingAccounts = await getAllAccounts();
  const existingClasses = await getAllClasses();
  const existingSpecializations = await getAllSpecializations();
  const existingPvPRanks = await getAllPvPRanks();

  return (
    <NewCharacterForm
      accountId={accountId}
      existingAccounts={existingAccounts}
      existingClasses={existingClasses}
      existingSpecializations={existingSpecializations}
      existingPvPRanks={existingPvPRanks}
    />
  );
}
