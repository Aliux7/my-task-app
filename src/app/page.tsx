import { TaskList } from "@/components/tasks/task-list";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Task Manager</h1>
          <p className="text-muted-foreground mt-2">
            Manage your tasks efficiently
          </p>
        </div>
        <TaskList key={1} /> 
      </div>
    </div>
  );
}
