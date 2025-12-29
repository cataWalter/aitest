"use client";

import { useRef, useState } from "react";

import { Doc } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TitleProps {
  initialData: Doc<"documents">;
};

export const Title = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("Untitled");
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setTitle("Untitled");
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      <p className="font-normal text-sm text-muted-foreground">/ Page Title</p>
    </div>
  )
};
