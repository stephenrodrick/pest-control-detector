import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const totalFiles = Number.parseInt(formData.get("totalFiles") as string)

    if (!totalFiles || totalFiles === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    const uploadId = uuidv4()
    const uploadDir = path.join(process.cwd(), "uploads", "datasets", uploadId)

    // Create upload directory
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Process files
    const files: File[] = []
    for (let i = 0; i < totalFiles; i++) {
      const file = formData.get(`file_${i}`) as File
      if (file) {
        files.push(file)
      }
    }

    // Save files and organize by structure
    const savedFiles: string[] = []
    const classStructure: Record<string, string[]> = {}

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Preserve folder structure from file path
      const relativePath = file.webkitRelativePath || file.name
      const filePath = path.join(uploadDir, relativePath)
      const fileDir = path.dirname(filePath)

      // Create directory if it doesn't exist
      if (!existsSync(fileDir)) {
        await mkdir(fileDir, { recursive: true })
      }

      // Save file
      await writeFile(filePath, buffer)
      savedFiles.push(relativePath)

      // Extract class information from path
      const pathParts = relativePath.split("/")
      if (pathParts.length >= 2 && file.type.startsWith("image/")) {
        const className = pathParts[pathParts.length - 2] // Parent folder name
        if (!classStructure[className]) {
          classStructure[className] = []
        }
        classStructure[className].push(relativePath)
      }
    }

    // Store upload metadata
    const metadata = {
      uploadId,
      totalFiles: savedFiles.length,
      classStructure,
      uploadTime: new Date().toISOString(),
      status: "uploaded",
    }

    // Save metadata
    await writeFile(path.join(uploadDir, "metadata.json"), JSON.stringify(metadata, null, 2))

    // Start background processing
    processDataset(uploadId, uploadDir, classStructure)

    return NextResponse.json({
      success: true,
      uploadId,
      filesUploaded: savedFiles.length,
      classesDetected: Object.keys(classStructure).length,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed: " + (error instanceof Error ? error.message : "Unknown error") },
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

    // Simulate processing steps
    const steps = [
      { progress: 20, message: "Validating image files..." },
      { progress: 40, message: "Extracting image features..." },
      { progress: 60, message: "Building class index..." },
      { progress: 80, message: "Creating search index..." },
      { progress: 100, message: "Processing complete!" },
    ]

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time
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
