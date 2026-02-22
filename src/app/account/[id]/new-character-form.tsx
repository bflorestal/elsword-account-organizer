"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
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
  characters,
  classes,
  specializations,
  pvpRanks,
} from "~/server/db/schema";
import { createCharacterAction } from "~/server/actions/createCharacter";
import { toast } from "sonner";

const characterFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      error: "Le nom doit comporter au moins 2 caractères.",
    })
    .max(100),
  classId: z.string({ error: "Veuillez sélectionner une classe." }).min(1),
  level: z.string().refine(
    (val) => {
      const n = Number(val);
      return !isNaN(n) && n >= 1 && n <= 99;
    },
    { error: "Le niveau doit être entre 1 et 99." },
  ),
  specializationId: z.string().optional(),
  pvpRankId: z.string().optional(),
});

type CharacterFormData = z.infer<typeof characterFormSchema>;

type Props = {
  accountId: number;
  existingAccounts: Array<
    typeof accounts.$inferSelect & {
      server: typeof import("~/server/db/schema").servers.$inferSelect;
      characters: Array<typeof characters.$inferSelect>;
    }
  >;
  existingClasses: Array<typeof classes.$inferSelect>;
  existingSpecializations: Array<
    typeof specializations.$inferSelect & {
      class?: typeof classes.$inferSelect | null;
    }
  >;
  existingPvPRanks: Array<typeof pvpRanks.$inferSelect>;
};

export function NewCharacterForm({
  accountId,
  existingClasses,
  existingSpecializations,
  existingPvPRanks,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CharacterFormData>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: {
      username: "",
      classId: "",
      level: "1",
      specializationId: "",
      pvpRankId: "",
    },
  });

  const selectedClassId = form.watch("classId");

  const filteredSpecializations = useMemo(() => {
    if (!selectedClassId) return [];
    return existingSpecializations.filter(
      (spec) => spec.classId === parseInt(selectedClassId),
    );
  }, [selectedClassId, existingSpecializations]);

  const selectedClass = useMemo(() => {
    if (!selectedClassId) return null;
    return existingClasses.find((c) => c.id === parseInt(selectedClassId));
  }, [selectedClassId, existingClasses]);

  const selectedSpecId = form.watch("specializationId");
  const selectedSpec = useMemo(() => {
    if (!selectedSpecId) return null;
    return existingSpecializations.find(
      (s) => s.id === parseInt(selectedSpecId),
    );
  }, [selectedSpecId, existingSpecializations]);

  const selectedPvpRankId = form.watch("pvpRankId");
  const selectedPvpRank = useMemo(() => {
    if (!selectedPvpRankId) return null;
    return existingPvPRanks.find((r) => r.id === parseInt(selectedPvpRankId));
  }, [selectedPvpRankId, existingPvPRanks]);

  async function onSubmit(data: CharacterFormData) {
    setIsLoading(true);

    try {
      const result = await createCharacterAction({
        username: data.username,
        accountId,
        classId: parseInt(data.classId),
        level: parseInt(data.level),
        specializationId: data.specializationId
          ? parseInt(data.specializationId)
          : null,
        pvpRankId: data.pvpRankId ? parseInt(data.pvpRankId) : null,
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
        <button className="flex items-center gap-2 text-sm tracking-widest px-3 py-1.5 rounded border border-red-900/30 transition-all cursor-pointer hover:border-red-600/50 hover:bg-red-950/30 font-teko text-el-red">
          <Plus className="w-4 h-4" />
          Créer
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="font-teko text-[1.75rem] tracking-wide">
            Nouveau personnage
          </DialogTitle>
          <DialogDescription>
            Ajoutez un personnage à ce compte.
          </DialogDescription>
        </DialogHeader>

        {(selectedClass || selectedSpec || selectedPvpRank) && (
          <div className="flex items-center justify-center gap-3 py-2">
            {selectedClass && (
              <Image
                src={selectedClass.iconUrl}
                alt={selectedClass.name}
                width={40}
                height={40}
                className="rounded"
              />
            )}
            {selectedSpec && (
              <Image
                src={selectedSpec.iconUrl}
                alt={selectedSpec.name}
                width={40}
                height={40}
                className="rounded"
              />
            )}
            {selectedPvpRank?.iconUrl && (
              <Image
                src={selectedPvpRank.iconUrl}
                alt={selectedPvpRank.name}
                width={32}
                height={32}
              />
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du personnage</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom du personnage" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classe</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("specializationId", "");
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Classe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {existingClasses.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Image
                                src={cls.iconUrl}
                                alt={cls.name}
                                width={20}
                                height={20}
                                className="rounded-sm"
                              />
                              {cls.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        max={99}
                        placeholder="Niveau"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="specializationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spécialisation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={
                      !selectedClassId || filteredSpecializations.length === 0
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedClassId
                              ? "Choisissez d'abord une classe"
                              : filteredSpecializations.length === 0
                                ? "Aucune spécialisation"
                                : "Spécialisation"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredSpecializations.map((spec) => (
                        <SelectItem key={spec.id} value={spec.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={spec.iconUrl}
                              alt={spec.name}
                              width={20}
                              height={20}
                              className="rounded-sm"
                            />
                            {spec.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pvpRankId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rang PvP</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Rang PvP (optionnel)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {existingPvPRanks.map((rank) => (
                        <SelectItem key={rank.id} value={rank.id.toString()}>
                          <div className="flex items-center gap-2">
                            {rank.iconUrl && (
                              <Image
                                src={rank.iconUrl}
                                alt={rank.name}
                                width={20}
                                height={20}
                              />
                            )}
                            {rank.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-2">
              <Button
                disabled={isLoading}
                type="submit"
                className="cursor-pointer"
              >
                Créer le personnage
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
