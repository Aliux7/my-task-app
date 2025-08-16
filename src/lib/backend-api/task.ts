import type { CreateTaskRequest, UpdateTaskRequest } from "@/types/task";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchTaskById(id: string) {
  const response = await fetch(`${BASE_URL}tasks/${id}`);
  if (!response.ok) throw new Error("Failed to fetch task");
  return response.json();
}

export async function updateTask(id: string, data: UpdateTaskRequest) {
  const response = await fetch(`${BASE_URL}tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
}

export async function createTask(data: CreateTaskRequest) {
  const response = await fetch(`${BASE_URL}tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create task");

  return response.json();
}

export async function fetchTasks(page = 1, status = "all") {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "10",
  });

  if (status !== "all") {
    params.append("status", status);
  }

  const response = await fetch(`${BASE_URL}tasks?${params}`);

  if (!response.ok) throw new Error("Failed to fetch tasks");

  return response.json();
}

export async function deleteTask(id: string) {
  const response = await fetch(`${BASE_URL}tasks/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to delete task");
 
  if (response.status === 204) {
    return true;
  }

  return response.json();
}
