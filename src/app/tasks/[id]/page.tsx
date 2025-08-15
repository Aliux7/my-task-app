"use client";

import type React from "react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

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
import { useTaskStore } from "@/lib/store";
import type { UpdateTaskRequest } from "@/types/task";

export default function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { updateTaskById, isLoading } = useTaskStore();

  const { id } = use(params);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TO_DO" as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingTask, setIsLoadingTask] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }
        const task = await response.json();
        setFormData({
          title: task.title,
          description: task.description || "",
          status: task.status,
        });
      } catch (error) {
        console.error("Error fetching task:", error);
        toast.error("Failed to load task data");
        router.push("/");
      } finally {
        setIsLoadingTask(false);
      }
    };

    fetchTask();
  }, [id, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updateTaskData: UpdateTaskRequest = {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
      };

      await updateTaskById(id, updateTaskData);
      toast.success("Task updated successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (isLoadingTask) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-8">
            {" "}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
              <p className="text-muted-foreground mt-1">
                Update your task details and status.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-24 bg-muted rounded"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-24 bg-muted rounded"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-24 bg-muted rounded"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {" "}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
            <p className="text-muted-foreground mt-1">
              Update your task details and status.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Form Card */}
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Field */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">
                    Task Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter a clear, descriptive title for your task"
                    className="h-11"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    A concise title that clearly describes what needs to be
                    done.
                  </p>
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-base font-medium"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Add any additional details, requirements, or notes about this task..."
                    className="min-h-[120px] resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Optional details to provide more context about the task.
                  </p>
                  {errors.description && (
                    <p className="text-sm text-destructive">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Status Field */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Task Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
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

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Task
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
