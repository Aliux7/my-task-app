"use client";

import React from "react";
import { Save, ArrowLeft } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function EditTaskForm({
  formData,
  errors,
  onChange,
  onSubmit,
}: Props) {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Save className="h-5 w-5 text-primary" />
            Update Task Details
          </CardTitle>
          <CardDescription>
            Modify the information below to update your task.
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

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Task Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => onChange("status", value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select the task status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TO_DO">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      To Do
                    </div>
                  </SelectItem>
                  <SelectItem value="IN_PROGRESS">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      In Progress
                    </div>
                  </SelectItem>
                  <SelectItem value="DONE">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Done
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Update the current status of this task.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6">
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
                  <Save className="w-4 h-4 mr-2" />
                  Update Task
                </>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
