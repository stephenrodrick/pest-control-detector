import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: { uploadId: string } }) {
  try {
    const { uploadId } = params
    const uploadDir = path.join(process.cwd(), "uploads", "datasets", uploadId)
    const statusFile = path.join(uploadDir, "status.json")

    if (!existsSync(statusFile)) {
      return NextResponse.json({ error: "Upload not found" }, { status: 404 })
    }

    const statusData = await readFile(statusFile, "utf-8")
    const status = JSON.parse(statusData)

    return NextResponse.json(status)
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 })
  }
}
