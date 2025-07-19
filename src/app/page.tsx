import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SteamIcon } from "~/components/steam-icon";
import { getAllAccounts } from "~/server/db/queries";

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Liste de comptes</h1>

      <Suspense
        fallback={<div className="min-h-80 min-w-96">Loading accounts...</div>}
      >
        <AccountsList />
      </Suspense>
    </div>
  );
}

async function AccountsList() {
  const accountsList = await getAllAccounts();

  return (
    <ul className="flex flex-col gap-4">
      {accountsList.map((acc) => (
        <li key={acc.id}>
          <div className="flex items-center space-x-1">
            {acc.isSteam && <SteamIcon className="w-4 h-4 fill-white" />}
            <h2 className="text-xl font-bold">
              <Link href={`/account/${acc.id}`} className="hover:underline">
                {acc.username}
              </Link>{" "}
              <span className="font-normal">({acc.server.name})</span>{" "}
              <span className="text-blue-400">{acc.resonanceLevel}</span>
            </h2>
          </div>

          <div className="flex flex-col gap-2 p-4 border rounded-lg w-full sm:w-[400px]">
            {acc.characters.length > 0 ? (
              acc.characters.map((char) => (
                <div key={char.id} className="flex items-center gap-2">
                  <Image
                    src={char.specialization?.iconUrl ?? char.class.iconUrl}
                    alt={char.specialization?.name ?? char.class.name}
                    className="w-8 h-8"
                    width={40}
                    height={40}
                  />
                  <Link
                    href={`/character/${char.id}`}
                    className="hover:underline"
                  >
                    <h3 className="font-semibold">{char.username}</h3>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Aucun personnage</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
