"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
  updatedAt: string;
}

interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const router = useRouter();
  const searchParams = useSearchParams();
 
  const currentPage = Number.parseInt(searchParams.get("page") || "1");
  const currentStatus = searchParams.get("status") || "all";

  useEffect(() => {
    setStatusFilter(currentStatus);
    fetchTasks(currentPage, currentStatus);
  }, [currentPage, currentStatus]);

  const fetchTasks = async (page = 1, status = "all") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (status !== "all") {
        params.append("status", status);
      }

      const response = await fetch(`/api/tasks?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data: TasksResponse = await response.json();
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.set("page", "1"); // Reset to first page when filtering
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/?${params.toString()}`);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      toast.success("Task deleted successfully.");

      // Refresh the task list
      fetchTasks(currentPage, currentStatus);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  const getStatusBadgeVariant = (status: Task["status"]) => {
    switch (status) {
      case "TO_DO":
        return "secondary";
      case "IN_PROGRESS":
        return "default";
      case "DONE":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "TO_DO":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "IN_PROGRESS":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "DONE":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Task button and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          onClick={() => router.push("/tasks/create")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Task
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Filter by status:
          </span>
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="TO_DO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No tasks found. Create your first task to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={getStatusBadgeVariant(task.status)}
                    className={getStatusColor(task.status)}
                  >
                    {task.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                    {task.updatedAt !== task.createdAt && (
                      <span className="ml-2">
                        • Updated:{" "}
                        {new Date(task.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/tasks/${task.id}`)}
                      className="flex items-center gap-1 cursor-pointer bg-purple-50 text-purple-600 border-none hover:text-purple-800 hover:bg-purple-100"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 cursor-pointer bg-red-50 text-red-600 border-none hover:text-red-800 hover:bg-red-100"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Task</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{task.title}"? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-none shadow-none text-gray-700 hover:gray-800 cursor-pointer">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTask(task.id)}
                            className="cursor-pointer bg-red-50 text-red-600 border border-red-200 hover:text-red-800 hover:bg-red-100"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1;
              const isCurrentPage = page === pagination.page;

              // Show first page, last page, current page, and pages around current
              const showPage =
                page === 1 ||
                page === pagination.totalPages ||
                Math.abs(page - pagination.page) <= 1;

              if (!showPage) {
                // Show ellipsis for gaps
                if (page === 2 && pagination.page > 4) {
                  return (
                    <span
                      key="ellipsis-start"
                      className="px-2 text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                }
                if (
                  page === pagination.totalPages - 1 &&
                  pagination.page < pagination.totalPages - 3
                ) {
                  return (
                    <span
                      key="ellipsis-end"
                      className="px-2 text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <Button
                  key={page}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {tasks.length} of {pagination.total} tasks
        {pagination.totalPages > 1 && (
          <span>
            {" "}
            • Page {pagination.page} of {pagination.totalPages}
          </span>
        )}
      </div>
    </div>
  );
}
