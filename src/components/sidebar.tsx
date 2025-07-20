import { House } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { NewAccountForm } from "~/components/new-account-form";

import { getAllServers } from "~/server/db/queries";

export default function Sidebar() {
  return (
    <aside className="no-scrollbar font-semibold text-slate-200 w-full lg:w-64 h-full flex-col hidden lg:flex p-5">
      <div>
        <h1 className="font-bold mb-4">Elsword Account Organizer</h1>
        <Link
          href="/"
          className="text-white flex space-x-2 hover:bg-gray-700/20 rounded-lg p-2"
        >
          <House className="w-6 h-6" />
          <span>Home</span>
        </Link>

        <Separator className="my-4" />

        <Suspense
          fallback={
            <Button disabled className="w-full">
              Ajouter un compte
            </Button>
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
