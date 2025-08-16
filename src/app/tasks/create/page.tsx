"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CreateTaskRequest } from "@/types/task";
import { createTask } from "@/lib/backend-api/task";
import CreateTaskForm from "@/components/tasks/task-create";

export default function CreateTaskPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TO_DO" as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title?.length > 100) {
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
      const createTaskData: CreateTaskRequest = {
        title: formData.title,
        description: formData.description || undefined,
      };

      await createTask(createTaskData);

      toast.success("Task created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Task
            </h1>
            <p className="text-muted-foreground mt-1">
              Add a new task to your task list with details and priority.
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

        <CreateTaskForm
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
