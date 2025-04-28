import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "../ui/"; // Fixed import path

const Selection = ({
  options = [],
  placeholder = "Select...",
  label,
  isLoading = false,
  className,
  onValueChange,
  defaultValue,
}) => {
  if (isLoading) {
    return (
      <div className={className}>
        {label && <Skeleton className="h-4 w-24 mb-2" />}
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <Select onValueChange={onValueChange} defaultValue={defaultValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Selection;