"use client";

import { useParams, useRouter } from "next/navigation";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
        </p>
        {/* Placeholder for mapping through filtered documents */}
      </div>
    </div>
  );
};
