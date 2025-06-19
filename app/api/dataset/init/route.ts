import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const { totalFiles, totalSize } = await request.json()

    if (!totalFiles || totalFiles === 0) {
      return NextResponse.json({ error: "Invalid file count" }, { status: 400 })
    }

    // Check if total size is reasonable (max 10GB)
    const maxSize = 10 * 1024 * 1024 * 1024 // 10GB
    if (totalSize > maxSize) {
      return NextResponse.json(
        { error: `Dataset too large. Maximum size is ${maxSize / (1024 * 1024 * 1024)}GB` },
        { status: 413 },
      )
    }

    const uploadId = uuidv4()
    const uploadDir = path.join(process.cwd(), "uploads", "datasets", uploadId)

    // Create upload directory
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Create upload session metadata
    const sessionData = {
      uploadId,
      totalFiles,
      totalSize,
      uploadedChunks: 0,
      totalChunks: 0,
      status: "initialized",
      createdAt: new Date().toISOString(),
      files: [],
    }

    await writeFile(path.join(uploadDir, "session.json"), JSON.stringify(sessionData, null, 2))

    return NextResponse.json({
      success: true,
      uploadId,
      message: "Upload session initialized",
    })
  } catch (error) {
    console.error("Init error:", error)
    return NextResponse.json(
      { error: "Failed to initialize upload: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}
