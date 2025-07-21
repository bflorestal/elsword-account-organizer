"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import {
  accounts,
  classes,
  pvpRanks,
  specializations,
  // classes,
  // specializations,
  // pvpRanks,
} from "~/server/db/schema";
import { createCharacterAction } from "~/server/actions/createCharacter";
import Image from "next/image";

const characterFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      error: "Le nom doit comporter au moins 3 caractères.",
    })
    .max(20, {
      error: "Le nom ne peut pas dépasser 20 caractères.",
    }),
  accountId: z.string({ error: "Veuillez sélectionner un compte." }).min(1),
  classId: z.string({ error: "Veuillez sélectionner un personnage." }).min(1),
  level: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
    error: "Le niveau doit être un nombre supérieur ou égal à 1.",
  }),
  specializationId: z.string().optional(),
  pvpRankId: z.string().optional(),
});
type CharacterFormData = z.infer<typeof characterFormSchema>;

type NewCharacterFormProps = {
  accountId?: number;
  existingAccounts: Array<typeof accounts.$inferSelect>;
  existingClasses: Array<typeof classes.$inferSelect>;
  existingSpecializations: Array<typeof specializations.$inferSelect>;
  existingPvPRanks: Array<typeof pvpRanks.$inferSelect>;
};

export function NewCharacterForm({
  accountId,
  existingAccounts,
  existingClasses,
  existingSpecializations,
  existingPvPRanks,
}: NewCharacterFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CharacterFormData>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: {
      username: "",
      accountId: accountId ? accountId.toString() : "",
      classId: "",
      level: "1",
      specializationId: "",
      pvpRankId: "",
    },
  });

  const selectedClassId = form.watch("classId");

  const filteredSpecializations = useMemo(() => {
    return selectedClassId
      ? existingSpecializations.filter(
          (spec) => spec.classId === parseInt(selectedClassId)
        )
      : [];
  }, [selectedClassId, existingSpecializations]);

  useEffect(() => {
    if (selectedClassId) {
      const currentSpecializationId = form.getValues("specializationId");
      const isSpecializationValid = filteredSpecializations.some(
        (spec) => spec.id.toString() === currentSpecializationId
      );

      if (!isSpecializationValid) {
        form.setValue("specializationId", "");
      }
    } else {
      form.setValue("specializationId", "");
    }
  }, [selectedClassId, filteredSpecializations, form]);

  async function onSubmit(data: CharacterFormData) {
    setIsLoading(true);

    try {
      const result = await createCharacterAction({
        ...data,
        accountId: parseInt(data.accountId),
        classId: parseInt(data.classId),
        level: parseInt(data.level),
        specializationId: data.specializationId
          ? parseInt(data.specializationId)
          : undefined,
        pvpRankId: data.pvpRankId ? parseInt(data.pvpRankId) : undefined,
      });

      if (result.success) {
        toast.success("Personnage créé avec succès !");
        form.reset();
        setIsOpen(false);
      } else {
        toast.error("Erreur lors de la création du personnage.", {
          description: result.error?.message || "Veuillez réessayer.",
        });
      }
    } catch (error) {
      toast.error("Une erreur inattendue s'est produite.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Créer un personnage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un personnage</DialogTitle>
          <DialogDescription>
            Entrez les informations du personnage que vous souhaitez créer.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!accountId && (
              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compte</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un compte" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {existingAccounts.map((account) => (
                          <SelectItem
                            key={account.id}
                            value={account.id.toString()}
                          >
                            {account.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d&apos;utilisateur</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      minLength={3}
                      maxLength={20}
                      placeholder="Entrez le nom d'utilisateur"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      placeholder="Niveau du personnage"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personnage</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un personnage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {existingClasses.map((classItem) => (
                        <SelectItem
                          key={classItem.id}
                          value={classItem.id.toString()}
                        >
                          <div>
                            <Image
                              src={classItem.iconUrl}
                              alt={classItem.name}
                              className="w-6 h-6 inline-block mr-2"
                              width={54}
                              height={54}
                            />
                            {classItem.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={
                !selectedClassId || filteredSpecializations.length === 0
              }
              name="specializationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spécialisation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une spécialisation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredSpecializations.map((spec) => (
                        <SelectItem key={spec.id} value={spec.id.toString()}>
                          <div className="flex items-center">
                            <Image
                              src={spec.iconUrl}
                              alt={spec.name}
                              className="w-6 h-6 inline-block mr-2"
                              width={36}
                              height={36}
                            />
                            {spec.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pvpRankId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rang PvP</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un rang PvP" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {existingPvPRanks.map((rank) => (
                        <SelectItem key={rank.id} value={rank.id.toString()}>
                          <div className="flex items-center">
                            {rank.iconUrl ? (
                              <Image
                                src={rank.iconUrl}
                                alt={rank.name}
                                className="w-6 h-6 inline-block mr-2"
                                width={36}
                                height={36}
                              />
                            ) : (
                              <div className="w-6 h-6 inline-block mr-2" />
                            )}
                            {rank.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button
                disabled={isLoading}
                type="submit"
                className="cursor-pointer"
              >
                Ajouter
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
