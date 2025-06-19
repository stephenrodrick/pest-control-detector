import { type NextRequest, NextResponse } from "next/server"
import { readFile, readdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const uploadsDir = path.join(process.cwd(), "uploads", "datasets")

    if (!existsSync(uploadsDir)) {
      return NextResponse.json({
        hasDataset: false,
        message: "No uploads directory found",
      })
    }

    // Find the most recent completed dataset
    const uploadDirs = await readdir(uploadsDir)

    for (const dir of uploadDirs.reverse()) {
      // Check most recent first
      const candidatePath = path.join(uploadsDir, dir)
      const indexFile = path.join(candidatePath, "dataset_index.json")
      const statusFile = path.join(candidatePath, "status.json")

      if (existsSync(indexFile) && existsSync(statusFile)) {
        try {
          const indexData = await readFile(indexFile, "utf-8")
          const statusData = await readFile(statusFile, "utf-8")

          const datasetIndex = JSON.parse(indexData)
          const status = JSON.parse(statusData)

          if (status.status === "complete" && datasetIndex.status === "ready") {
            return NextResponse.json({
              hasDataset: true,
              uploadId: datasetIndex.uploadId,
              stats: {
                totalImages: datasetIndex.totalImages,
                totalClasses: datasetIndex.totalClasses,
                classDistribution: datasetIndex.classDistribution,
              },
              message: "Dataset ready for use",
            })
          }
        } catch (error) {
          console.log(`Error reading dataset ${dir}:`, error)
          continue
        }
      }
    }

    return NextResponse.json({
      hasDataset: false,
      message: "No completed dataset found",
    })
  } catch (error) {
    console.error("Dataset check error:", error)
    return NextResponse.json({
      hasDataset: false,
      error: "Failed to check dataset status",
    })
  }
}
