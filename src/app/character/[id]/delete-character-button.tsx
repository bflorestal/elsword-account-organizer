"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { deleteCharacterAction } from "~/server/actions/deleteCharacter";

export function DeleteCharacterButton({
  characterId,
  accountId,
}: {
  characterId: number;
  accountId: number;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteCharacter = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCharacterAction(characterId);
      if (result.success) {
        toast.success("Personnage supprimé avec succès");
        router.push(`/account/${accountId}`);
      } else {
        toast.error(
          result.error?.message ||
            "Erreur lors de la suppression du personnage",
        );
      }
    } catch (error) {
      console.error("Error deleting character:", error);
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-red-400 bg-transparent cursor-pointer"
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer le personnage
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le personnage</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le personnage ?<br />
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteCharacter}
              disabled={isDeleting}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-red-400 bg-transparent cursor-pointer"
            >
              {isDeleting ? "Suppression..." : "Supprimer définitivement"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
