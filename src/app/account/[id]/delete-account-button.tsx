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
import { deleteAccountAction } from "~/server/actions/deleteAccount";

interface DeleteAccountButtonProps {
  accountId: number;
}

export function DeleteAccountButton({ accountId }: DeleteAccountButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteAccountAction(accountId);

      if (result.success) {
        toast.success("Compte supprimé avec succès");
        router.push("/");
      } else {
        toast.error(
          result.error?.message || "Erreur lors de la suppression du compte"
        );
      }
    } catch (error) {
      console.error("Error deleting account:", error);
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
          Supprimer le compte
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Supprimer le compte
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Êtes-vous sûr de vouloir supprimer ce compte ?<br />
            Les personnages associés seront également supprimés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600 cursor-pointer">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAccount}
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
