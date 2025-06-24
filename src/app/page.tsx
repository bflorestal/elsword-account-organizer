import Image from "next/image";
import { Suspense } from "react";
import { getAllAccounts } from "~/db/queries";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Liste de comptes</h1>

        <Suspense
          fallback={
            <div className="min-h-80 min-w-96">Loading accounts...</div>
          }
        >
          <AccountsList />
        </Suspense>
      </main>
    </div>
  );
}

async function AccountsList() {
  const accountsList = await getAllAccounts();

  return (
    <ul className="flex flex-col gap-4">
      {accountsList.map((acc) => (
        <li key={acc.id}>
          <h2 className="text-xl font-bold">
            {acc.username}{" "}
            <span className="font-normal">({acc.server.name})</span>
          </h2>

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
                  <span className="font-semibold">{char.username}</span>
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
