"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Checkbox } from "~/components/ui/checkbox";
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

import { servers } from "~/server/db/schema";
import { createAccountAction } from "~/server/actions/createAccount";
import { toast } from "sonner";

const accountFormSchema = z.object({
  username: z
    .string()
    .min(3, {
      error: "Le nom d'utilisateur doit comporter au moins 3 caractères.",
    })
    .max(100),
  serverId: z.string({ error: "Veuillez sélectionner un serveur." }).min(1),
  resonanceLevel: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      error:
        "Le niveau de résonance doit être un nombre supérieur ou égal à 0.",
    }),
  isSteam: z.boolean(),
});
type AccountFormData = z.infer<typeof accountFormSchema>;

export function NewAccountForm({
  existingServers,
}: {
  existingServers: Array<typeof servers.$inferSelect>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: "",
      serverId: "",
      isSteam: false,
      resonanceLevel: "0",
    },
  });

  async function onSubmit(data: AccountFormData) {
    setIsLoading(true);
    console.dir(data);

    try {
      const result = await createAccountAction({
        ...data,
        serverId: parseInt(data.serverId),
        resonanceLevel: parseInt(data.resonanceLevel),
      });

      if (result.success) {
        toast.success("Compte créé avec succès !");
        form.reset();
        setIsOpen(false);
      } else {
        toast.error("Erreur lors de la création du compte.", {
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
        <Button variant="outline" className="w-full cursor-pointer">
          Ajouter un compte
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un compte</DialogTitle>
          <DialogDescription>
            Entrez les informations du compte que vous souhaitez ajouter.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d&apos;utilisateur</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Entrez le nom d'utilisateur"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serveur</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un serveur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {existingServers.map((server) => (
                        <SelectItem
                          key={server.id}
                          value={server.id.toString()}
                        >
                          {server.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resonanceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau de résonance</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      placeholder="Entrez le niveau de résonance"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isSteam"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Compte Steam</FormLabel>
                  <FormMessage />
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
