import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { uploadId } = await request.json()

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

    if (sessionData.status !== "uploaded") {
      return NextResponse.json({ error: "Upload not complete" }, { status: 400 })
    }

    // Organize files by class structure
    const classStructure: Record<string, string[]> = {}
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif"]

    for (const filePath of sessionData.files) {
      const ext = path.extname(filePath).toLowerCase()
      if (imageExtensions.includes(ext)) {
        const pathParts = filePath.split(path.sep)
        if (pathParts.length >= 2) {
          const className = pathParts[pathParts.length - 2] // Parent folder name
          if (!classStructure[className]) {
            classStructure[className] = []
          }
          classStructure[className].push(filePath)
        }
      }
    }

    // Update session with final data
    sessionData.classStructure = classStructure
    sessionData.status = "finalized"
    sessionData.finalizedAt = new Date().toISOString()

    await writeFile(sessionFile, JSON.stringify(sessionData, null, 2))

    // Start background processing
    processDataset(uploadId, uploadDir, classStructure)

    return NextResponse.json({
      success: true,
      uploadId,
      totalFiles: sessionData.files.length,
      classesDetected: Object.keys(classStructure).length,
      message: "Upload finalized, processing started",
    })
  } catch (error) {
    console.error("Finalize error:", error)
    return NextResponse.json(
      { error: "Failed to finalize upload: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}

async function processDataset(uploadId: string, uploadDir: string, classStructure: Record<string, string[]>) {
  try {
    // Update status to processing
    const statusFile = path.join(uploadDir, "status.json")
    await writeFile(
      statusFile,
      JSON.stringify({
        status: "processing",
        progress: 0,
        message: "Analyzing dataset structure...",
      }),
    )

    // Simulate processing steps with realistic timing
    const steps = [
      { progress: 20, message: "Validating image files...", delay: 3000 },
      { progress: 40, message: "Extracting image features...", delay: 5000 },
      { progress: 60, message: "Building class index...", delay: 4000 },
      { progress: 80, message: "Creating search index...", delay: 3000 },
      { progress: 100, message: "Processing complete!", delay: 1000 },
    ]

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay))
      await writeFile(
        statusFile,
        JSON.stringify({
          status: "processing",
          progress: step.progress,
          message: step.message,
        }),
      )
    }

    // Calculate final statistics
    const totalImages = Object.values(classStructure).reduce((sum, images) => sum + images.length, 0)
    const totalClasses = Object.keys(classStructure).length

    // Create final dataset index
    const datasetIndex = {
      uploadId,
      totalImages,
      totalClasses,
      classStructure,
      classDistribution: Object.fromEntries(
        Object.entries(classStructure).map(([className, images]) => [className, images.length]),
      ),
      createdAt: new Date().toISOString(),
      status: "ready",
    }

    await writeFile(path.join(uploadDir, "dataset_index.json"), JSON.stringify(datasetIndex, null, 2))

    // Update final status
    await writeFile(
      statusFile,
      JSON.stringify({
        status: "complete",
        progress: 100,
        message: "Dataset ready for use!",
        stats: {
          totalImages,
          totalClasses,
          classDistribution: datasetIndex.classDistribution,
        },
      }),
    )
  } catch (error) {
    console.error("Processing error:", error)
    const statusFile = path.join(uploadDir, "status.json")
    await writeFile(
      statusFile,
      JSON.stringify({
        status: "error",
        error: error instanceof Error ? error.message : "Processing failed",
      }),
    )
  }
}
