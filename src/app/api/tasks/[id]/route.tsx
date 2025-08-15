import { type NextRequest, NextResponse } from "next/server";
import type { Task } from "@/types/task";

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete project documentation",
    description:
      "Write comprehensive documentation for the new feature including API references and user guides.",
    status: "IN_PROGRESS",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "2",
    title: "Review pull requests",
    description:
      "Review and provide feedback on pending pull requests from the development team.",
    status: "TO_DO",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
  },
  {
    id: "3",
    title: "Deploy to production",
    description:
      "Deploy the latest version to production environment after all tests pass.",
    status: "DONE",
    createdAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-15T11:20:00Z",
  },
  {
    id: "4",
    title: "Update dependencies",
    description:
      "Update all project dependencies to their latest stable versions and test for compatibility.",
    status: "TO_DO",
    createdAt: "2024-01-12T08:30:00Z",
    updatedAt: "2024-01-12T08:30:00Z",
  },
  {
    id: "5",
    title: "Optimize database queries",
    description:
      "Analyze and optimize slow database queries to improve application performance.",
    status: "IN_PROGRESS",
    createdAt: "2024-01-11T13:00:00Z",
    updatedAt: "2024-01-16T10:15:00Z",
  },
];

// GET /api/tasks/[id] - Fetch a single task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("[v0] GET task by ID:", params.id);
    const { id } = params;

    const task = mockTasks.find((t) => t.id === id);

    if (!task) {
      console.log("[v0] Task not found:", id);
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    console.log("[v0] Found mock task:", task);
    return NextResponse.json(task);
  } catch (error) {
    console.error("[v0] Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("[v0] PUT task by ID:", params.id);
    const { id } = params;
    const body = await request.json();

    const taskIndex = mockTasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      console.log("[v0] Task not found for update:", id);
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update the task
    const updatedTask: Task = {
      ...mockTasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    mockTasks[taskIndex] = updatedTask;
    console.log("[v0] Updated mock task:", updatedTask);
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("[v0] Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("[v0] DELETE task by ID:", params.id);
    const { id } = params;

    const taskIndex = mockTasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      console.log("[v0] Task not found for deletion:", id);
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Remove the task
    mockTasks.splice(taskIndex, 1);
    console.log("[v0] Deleted mock task:", id);

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
