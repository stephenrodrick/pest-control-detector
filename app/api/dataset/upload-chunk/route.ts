import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

// Configure Next.js to handle larger payloads
export const runtime = "nodejs"
export const maxDuration = 300 // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const uploadId = formData.get("uploadId") as string
    const chunkIndex = Number.parseInt(formData.get("chunkIndex") as string)
    const totalChunks = Number.parseInt(formData.get("totalChunks") as string)

    if (!uploadId) {
      return NextResponse.json({ error: "Upload ID required" }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), "uploads", "datasets", uploadId)
    const sessionFile = path.join(uploadDir, "session.json")

    if (!existsSync(sessionFile)) {
      return NextResponse.json({ error: "Upload session not found" }, { status: 404 })
    }

    // Read session data
    const sessionData = JSON.parse(await readFile(sessionFile, "utf-8"))

    // Process files in this chunk
    const chunkFiles: string[] = []
    let fileIndex = 0

    while (formData.get(`file_${fileIndex}`)) {
      const file = formData.get(`file_${fileIndex}`) as File
      const filePath = formData.get(`path_${fileIndex}`) as string

      if (file && filePath) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create full file path
        const fullPath = path.join(uploadDir, filePath)
        const fileDir = path.dirname(fullPath)

        // Create directory if it doesn't exist
        if (!existsSync(fileDir)) {
          await mkdir(fileDir, { recursive: true })
        }

        // Save file
        await writeFile(fullPath, buffer)
        chunkFiles.push(filePath)
      }

      fileIndex++
    }

    // Update session data
    sessionData.uploadedChunks = chunkIndex + 1
    sessionData.totalChunks = totalChunks
    sessionData.files.push(...chunkFiles)
    sessionData.status = chunkIndex + 1 === totalChunks ? "uploaded" : "uploading"

    await writeFile(sessionFile, JSON.stringify(sessionData, null, 2))

    return NextResponse.json({
      success: true,
      chunkIndex,
      filesInChunk: chunkFiles.length,
      totalUploaded: sessionData.files.length,
      isComplete: sessionData.status === "uploaded",
    })
  } catch (error) {
    console.error("Chunk upload error:", error)
    return NextResponse.json(
      { error: "Chunk upload failed: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}
