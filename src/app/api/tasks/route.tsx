import { type NextRequest, NextResponse } from "next/server"

const mockTasks = [
  {
    id: "1",
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the new feature",
    status: "TO_DO" as const,
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Review pull requests",
    description: "Review and approve pending pull requests",
    status: "IN_PROGRESS" as const,
    createdAt: "2024-01-14T14:30:00.000Z",
    updatedAt: "2024-01-15T09:15:00.000Z",
  },
  {
    id: "3",
    title: "Deploy to production",
    description: "Deploy the latest changes to production environment",
    status: "DONE" as const,
    createdAt: "2024-01-13T16:45:00.000Z",
    updatedAt: "2024-01-14T11:20:00.000Z",
  },
  {
    id: "4",
    title: "Update dependencies",
    description: "Update all project dependencies to latest versions",
    status: "TO_DO" as const,
    createdAt: "2024-01-12T09:00:00.000Z",
    updatedAt: "2024-01-12T09:00:00.000Z",
  },
  {
    id: "5",
    title: "Fix responsive design issues",
    description: "Address mobile layout problems on the dashboard",
    status: "IN_PROGRESS" as const,
    createdAt: "2024-01-11T13:20:00.000Z",
    updatedAt: "2024-01-15T08:45:00.000Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Mock API route hit successfully")

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let filteredTasks = mockTasks
    if (status && status !== "all") {
      filteredTasks = mockTasks.filter((task) => task.status === status)
    }

    const total = filteredTasks.length
    const offset = (page - 1) * limit
    const paginatedTasks = filteredTasks.slice(offset, offset + limit)

    console.log("[v0] Returning mock tasks:", paginatedTasks.length, "of", total)

    return NextResponse.json({
      tasks: paginatedTasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("[v0] Mock API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch tasks",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newTask = {
      id: (mockTasks.length + 1).toString(),
      title: body.title,
      description: body.description || "",
      status: body.status || "TO_DO",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockTasks.unshift(newTask)

    console.log("[v0] Created mock task:", newTask)

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error("[v0] Mock POST Error:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
