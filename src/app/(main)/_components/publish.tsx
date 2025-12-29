"use client";

import { Doc } from "@/convex/_generated/dataModel";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

interface PublishProps {
  initialData: Doc<"documents">
};

export const Publish = () => {
  const origin = useOrigin();

  const url = `${origin}/preview/${"documentId"}`;


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72" 
        align="end"
        alignOffset={8}
        forceMount
      >
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center text-center gap-y-2">
                <Globe className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">
                    Publish this document
                </p>
                <span className="text-xs text-muted-foreground">
                    Share your work with others.
                </span>
            </div>
            <div className="flex items-center">
                <input 
                    className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                    value={url}
                    disabled
                />
                <Button
                    className="h-8 rounded-l-none"
                >
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            <Button
                size="sm"
                className="w-full text-xs"
            >
                Unpublish
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
