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
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { deleteTask, fetchTasks } from "@/lib/backend-api/task";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
  updatedAt: string;
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
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number.parseInt(searchParams.get("page") || "1");
  const currentStatus = searchParams.get("status") || "all";

  const tasksByStatus = {
    TO_DO: tasks.filter((task) => task.status === "TO_DO"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    DONE: tasks.filter((task) => task.status === "DONE"),
  };

  useEffect(() => {
    setStatusFilter(currentStatus);
    loadTasks(currentPage, currentStatus);
  }, [currentPage, currentStatus]);

  const loadTasks = async (page = 1, status = "all") => {
    try {
      setLoading(true);

      const result = await fetchTasks(page, status);

      setTasks(result?.data);
      setPagination(result);
    } catch (error) {
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
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/?${params.toString()}`);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);

      toast.success("Task deleted successfully.");

      loadTasks(currentPage, currentStatus);
    } catch (error) {
      toast.error("Failed to delete task. Please try again.");
    }
  };

  const statusColumns = [
    { key: "TO_DO" as const, title: "To Do", tasks: tasksByStatus.TO_DO },
    {
      key: "IN_PROGRESS" as const,
      title: "In Progress",
      tasks: tasksByStatus.IN_PROGRESS,
    },
    { key: "DONE" as const, title: "Done", tasks: tasksByStatus.DONE },
  ];

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
        {[...Array(5)]?.map((_, i) => (
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          onClick={() => router.push("/tasks/create")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Task
        </Button>

        <div className="flex items- justify-between gap-4">
          {viewMode === "list" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Filter by status:
              </span>
              <Select value={currentStatus} onValueChange={handleStatusFilter}>
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
          )}
          <div className="flex items-center border rounded-lg p-1 gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-7 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-7 px-3"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {tasks?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No tasks found. Create your first task to get started!
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusColumns?.map((column: any) => (
            <div key={column.key} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {column.tasks.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {column.tasks.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        No {column.title.toLowerCase()} tasks
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  column?.tasks?.map((task: Task) => (
                    <Card
                      key={task.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <div className="px-4">
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-sm flex-1">
                                {task.title}
                              </h4>
                              <Badge
                                variant={getStatusBadgeVariant(task.status)}
                                className={`${getStatusColor(
                                  task.status
                                )} text-xs ml-2 flex-shrink-0`}
                              >
                                {task.status.replace("_", " ")}
                              </Badge>
                            </div>
                            {task.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/tasks/${task.id}`)}
                                className="h-7 w-7 p-0 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 hover:text-yellow-700"
                              >
                                <Edit className="h-3 w-3 " />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete your task.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-transparent border-none text-gray-600 hover:text-gray-700">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="text-red-600 bg-red-100 hover:bg-red-200"
                                      onClick={() => handleDeleteTask(task.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {tasks?.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              {viewMode === "list" ? (
                <>
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
                            Updated:{" "}
                            {new Date(task.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => router.push(`/tasks/${task.id}`)}
                          className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 hover:text-yellow-700"
                        >
                          <Edit className="h-4 w-4" /> Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your task.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-transparent border-none text-gray-600 hover:text-gray-700">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="text-red-600 bg-red-100 hover:bg-red-200"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={getStatusBadgeVariant(task.status)}
                      className={`${getStatusColor(
                        task.status
                      )} text-xs ml-2 flex-shrink-0`}
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/tasks/${task.id}`)}
                        className="h-7 w-7 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 bg-transparent"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your task.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
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
            {[...Array(pagination.totalPages)]?.map((_, i) => {
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
        Showing {tasks?.length} of {pagination?.total} tasks
        {pagination?.totalPages > 1 && (
          <span>
            {" "}
            • Page {pagination?.page} of {pagination?.totalPages}
          </span>
        )}
      </div>
    </div>
  );
}
