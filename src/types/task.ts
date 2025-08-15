export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: "TO_DO" | "IN_PROGRESS" | "DONE";
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: "TO_DO" | "IN_PROGRESS" | "DONE";
}
