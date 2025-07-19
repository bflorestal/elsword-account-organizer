import Image from "next/image";
import { notFound } from "next/navigation";
import { getCharacterById } from "~/server/db/queries";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: characterId } = await params;

  const parsedCharacterId = parseInt(characterId);

  if (isNaN(parsedCharacterId)) {
    notFound();
  }

  const character = await getCharacterById(parsedCharacterId);

  return (
    <div className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <div className="flex items-center space-x-1">
        <h1 className="text-2xl font-bold">{character.username}</h1>
      </div>

      <SpecializationDisplay
        displayData={character.specialization ?? character.class}
        pvpRank={character.pvpRank}
      />

      <p>Niveau {character.level}</p>
    </div>
  );
}

function SpecializationDisplay({
  displayData,
  pvpRank,
}: {
  displayData: { name: string; iconUrl: string };
  pvpRank?: { name: string; iconUrl: string | null } | null;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Image
          src={displayData.iconUrl}
          alt={displayData.name}
          width={40}
          height={40}
        />
        {pvpRank?.iconUrl && (
          <Image
            src={pvpRank.iconUrl}
            alt={pvpRank.name}
            width={36}
            height={36}
            className="absolute -bottom-2 -right-2 w-2/3"
          />
        )}
      </div>
      <h2>{displayData.name}</h2>
    </div>
  );
}
