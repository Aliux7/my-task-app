"use client";

import type React from "react";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditTaskForm from "@/components/tasks/task-form";
import type { UpdateTaskRequest } from "@/types/task";
import { fetchTaskById, updateTask } from "@/lib/backend-api/task";

export default function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TO_DO" as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingTask, setIsLoadingTask] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const task = await fetchTaskById(id);
        setFormData({
          title: task.title,
          description: task.description || "",
          status: task.status,
        });
      } catch (error) {
        toast.error("Failed to load task data");
        router.push("/");
      } finally {
        setIsLoadingTask(false);
      }
    };

    if (id) {
      loadTask();
    }
  }, [id, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData?.title?.length > 100) {
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

    if (!validateForm()) return;

    try {
      const updateTaskData: UpdateTaskRequest = {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
      };

      await updateTask(id, updateTaskData);

      toast.success("Task updated successfully!");
      router.push("/");
    } catch (error) {
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
          <div className="flex items-center justify-between gap-4 mb-8">
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
            <div className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-24 bg-muted rounded"></div>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-between gap-4 mb-8">
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

        <EditTaskForm
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
