"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReceiverCard } from "@/components/receiver-card";
import { useLocale } from "@/hooks/use-locale";
import { mockReceivers, mockBanks } from "@/lib/mock";
import type { Receiver } from "@/types";

export default function ReceiversPage() {
  const { t } = useLocale();
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteReceiver, setDeleteReceiver] = useState<Receiver | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReceivers = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReceivers(mockReceivers);
      setIsLoading(false);
    };
    loadReceivers();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredReceivers = receivers.filter((r) =>
    r.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!deleteReceiver) return;
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setReceivers((prev) => prev.filter((r) => r.id !== deleteReceiver.id));
    setDeleteReceiver(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/home">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {t("receivers.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {receivers.length} {t("receivers.subtitle")}
            </p>
          </div>
        </div>
        <Link href="/receivers/new">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("receivers.add")}
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("receivers.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Receivers List */}
      <div className="space-y-3">
        {filteredReceivers.length > 0 ? (
          filteredReceivers.map((receiver) => (
            <Card key={receiver.id} className="overflow-hidden">
              <CardContent className="flex items-center gap-4 p-4">
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {getInitials(receiver.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {receiver.fullName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockBanks.find((b) => b.code === receiver.bankCode)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {receiver.accountNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/send?receiver=${receiver.id}`}>
                    <Button size="sm">{t("receivers.send")}</Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/receivers/${receiver.id}/edit`}
                          className="flex items-center gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          {t("common.edit")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteReceiver(receiver)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("common.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {t("receivers.noResults")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("receivers.noResultsDesc")}
              </p>
            </div>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                {t("receivers.clearSearch")}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteReceiver}
        onOpenChange={() => setDeleteReceiver(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("receivers.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("receivers.deleteDescription", {
                name: deleteReceiver?.fullName || "this receiver",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
