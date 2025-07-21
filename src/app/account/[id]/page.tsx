import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Plus, Server, Trophy, Users } from "lucide-react";

import { SteamIcon } from "~/components/steam-icon";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
  getAccountById,
  getAllAccounts,
  getAllClasses,
  getAllPvPRanks,
  getAllSpecializations,
} from "~/server/db/queries";
import { Button } from "~/components/ui/button";
import { NewCharacterForm } from "./new-character-form";

import { DeleteAccountButton } from "./delete-account-button";

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center justify-between flex-col sm:flex-row">
          <div className="flex items-center space-x-4 flex-col sm:flex-row">
            <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center">
              <span className="text-xl text-background font-bold">
                {account.username.charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                {account.isSteam && (
                  <SteamIcon className="w-6 h-6 fill-white" />
                )}
                <h1 className="text-3xl font-bold">{account.username}</h1>
              </div>
              <div className="flex items-center space-x-4 mt-2 text-gray-400 flex-col sm:flex-row">
                <div className="flex items-center space-x-1">
                  <Server className="h-4 w-4" />
                  <span>Serveur : {account.server.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4" />
                  <span>
                    Rang de résonance d&apos;Eldrit : {account.resonanceLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DeleteAccountButton
            accountId={parsedAccountId}
            accountUsername={account.username}
          />
        </div>
      </div>

      <Separator className="bg-gray-700" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Personnages</h2>
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
              {account.characters.length}
            </Badge>
          </div>
          <Suspense
            fallback={
              <Button disabled variant="ghost">
                <Plus className="mr-2 h-4 w-4" /> Créer un personnage
              </Button>
            }
          >
            <NewCharacterButton accountId={parsedAccountId} />
          </Suspense>
        </div>

        <ul className="flex flex-col gap-4">
          {account.characters.length > 0 ? (
            account.characters.map((char) => (
              <li key={char.id} className="flex items-center gap-2">
                <div className="relative">
                  <Image
                    src={char.specialization?.iconUrl ?? char.class.iconUrl}
                    alt={char.specialization?.name ?? char.class.name}
                    className="w-8 h-8"
                    width={40}
                    height={40}
                  />
                  {char.pvpRank?.iconUrl && (
                    <Image
                      src={char.pvpRank.iconUrl}
                      alt={char.pvpRank.name}
                      width={36}
                      height={36}
                      className="absolute -bottom-2 -right-2 w-2/3"
                    />
                  )}
                </div>
                <Link
                  href={`/character/${char.id}`}
                  className="hover:underline"
                >
                  <h3 className="font-semibold">{char.username}</h3>
                </Link>{" "}
                - Niveau {char.level}
              </li>
            ))
          ) : (
            <p className="text-gray-500">Aucun personnage trouvé</p>
          )}
        </ul>
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
