import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Server, Zap, Shield, Swords } from "lucide-react";

import { Breadcrumb } from "~/components/breadcrumb";
import { DeleteCharacterButton } from "./delete-character-button";
import { getCharacterById } from "~/server/db/queries";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: characterId } = await params;
  const idAsNumber = parseInt(characterId);

  if (isNaN(idAsNumber)) notFound();

  const character = await getCharacterById(idAsNumber);
  if (!character) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumb
        items={[
          { label: "Comptes", href: "/" },
          {
            label: character.account.username,
            href: `/account/${character.accountId}`,
          },
          { label: character.username },
        ]}
      />

      <div
        className="relative rounded-xl border border-red-900/30 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(220,38,38,0.06) 0%, rgba(10,10,10,0.8) 50%, rgba(220,38,38,0.03) 100%)",
        }}
      >
        <div
          className="h-1"
          style={{
            background:
              "linear-gradient(to right, #DC2626, #F59E0B 40%, transparent 80%)",
          }}
        />

        <div className="p-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-lg border border-red-900/40 overflow-hidden flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a0505 0%, #2a0a0a 100%)",
                  }}
                >
                  <Image
                    src={
                      character.specialization?.iconUrl ??
                      character.class.iconUrl
                    }
                    alt={character.specialization?.name ?? character.class.name}
                    width={64}
                    height={64}
                    className="rounded"
                  />
                </div>
                {character.pvpRank?.iconUrl && (
                  <Image
                    src={character.pvpRank.iconUrl}
                    alt={character.pvpRank.name}
                    width={28}
                    height={28}
                    className="absolute -bottom-1 -right-1"
                  />
                )}
              </div>

              <div>
                <h1
                  className="text-4xl sm:text-5xl tracking-wider font-bold font-teko text-el-red"
                  style={{
                    textShadow: "0 0 30px rgba(220,38,38,0.2)",
                  }}
                >
                  {character.username}
                </h1>
                <p className="text-sm text-neutral-400 mt-0.5">
                  {character.specialization?.name ?? character.class.name}
                </p>
              </div>
            </div>

            <DeleteCharacterButton
              characterId={idAsNumber}
              accountId={character.accountId}
            />
          </div>

          <div
            className="h-px"
            style={{
              background: "linear-gradient(to right, #DC2626, transparent 60%)",
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon={<Swords className="w-4 h-4 text-red-500/60" />}
              label="Niveau"
              value={`Niv. ${character.level}`}
            />

            <StatCard
              icon={
                <Image
                  src={character.class.iconUrl}
                  alt={character.class.name}
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
              }
              label="Classe"
              value={character.class.name}
            />

            <StatCard
              icon={
                character.pvpRank?.iconUrl ? (
                  <Image
                    src={character.pvpRank.iconUrl}
                    alt={character.pvpRank.name}
                    width={16}
                    height={16}
                  />
                ) : (
                  <Shield className="w-4 h-4 text-neutral-600" />
                )
              }
              label="Rang PvP"
              value={character.pvpRank?.name ?? "Non classé"}
            />

            <StatCard
              icon={<Server className="w-4 h-4 text-neutral-500" />}
              label="Serveur"
              value={character.account.server.name}
            />
          </div>

          <div
            className="rounded-lg border border-red-900/15 p-4 flex items-center justify-between"
            style={{ background: "rgba(220,38,38,0.03)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center text-sm font-bold border border-red-800/30 font-teko text-el-red"
                style={{
                  background: "linear-gradient(135deg, #1a0505, #2a0a0a)",
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                {character.account.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-300">
                  {character.account.username}
                </p>
                <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-500/60" />
                  Résonance {character.account.resonanceLevel}
                </p>
              </div>
            </div>
            <Link
              href={`/account/${character.accountId}`}
              className="text-sm tracking-widest px-3 py-1.5 rounded border border-red-900/30 transition-all hover:border-red-600/50 hover:bg-red-950/30 font-teko text-el-red"
            >
              Voir le compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-lg border border-red-900/15 p-3 space-y-1"
      style={{ background: "rgba(220,38,38,0.03)" }}
    >
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-neutral-500">
        {icon}
        {label}
      </div>
      <p className="text-sm font-semibold text-neutral-200">{value}</p>
    </div>
  );
}
