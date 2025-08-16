"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type Props = {
  formData: {
    title: string;
    description: string;
    status: "TO_DO" | "IN_PROGRESS" | "DONE";
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function CreateTaskForm({
  formData,
  errors,
  onChange,
  onSubmit,
}: Props) {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Plus className="h-5 w-5 text-primary" />
            Task Details
          </CardTitle>
          <CardDescription>
            Fill in the information below to create your new task.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Task Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter a clear, descriptive title for your task"
                className="h-11"
                value={formData.title}
                onChange={(e) => onChange("title", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                A concise title that clearly describes what needs to be done.
              </p>
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Add any additional details, requirements, or notes about this task..."
                className="min-h-[120px] resize-none"
                value={formData.description}
                onChange={(e) => onChange("description", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Optional details to provide more context about the task.
              </p>
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
