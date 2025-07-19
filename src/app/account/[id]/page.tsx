import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SteamIcon } from "~/components/steam-icon";
import { getAccountById } from "~/server/db/queries";

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
    <div className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <div className="flex items-center space-x-1">
        {account.isSteam && <SteamIcon className="w-4 h-4 fill-white" />}
        <h1 className="text-2xl font-bold">{account.username}</h1>
      </div>
      <h2 className="text-lg font-semibold">Serveur : {account.server.name}</h2>
      <p>Rang de résonance d&apos;Eldrit : {account.resonanceLevel}</p>

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
                {char.pvpRank.iconUrl && (
                  <Image
                    src={char.pvpRank.iconUrl}
                    alt={char.pvpRank.name}
                    width={36}
                    height={36}
                    className="absolute -bottom-2 -right-2 w-2/3"
                  />
                )}
              </div>
              <Link href={`/character/${char.id}`} className="hover:underline">
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
  );
}
