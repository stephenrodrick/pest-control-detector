"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Database, FolderOpen, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DatasetStats {
  totalImages: number
  totalClasses: number
  classDistribution: Record<string, number>
  uploadProgress: number
  processingStatus: string
}

export default function DatasetUploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [datasetStats, setDatasetStats] = useState<DatasetStats | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  // Add this after the existing state declarations
  const [totalSize, setTotalSize] = useState(0)
  const MAX_DATASET_SIZE = 10 * 1024 * 1024 * 1024 // 10GB
  const MAX_FILES = 100000 // Maximum number of files

  // Update the handleFileSelection function
  const handleFileSelection = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // Check file count
      if (files.length > MAX_FILES) {
        setErrorMessage(`Too many files. Maximum allowed: ${MAX_FILES}`)
        return
      }

      // Calculate total size
      const size = Array.from(files).reduce((sum, file) => sum + file.size, 0)
      if (size > MAX_DATASET_SIZE) {
        setErrorMessage(`Dataset too large. Maximum size: ${(MAX_DATASET_SIZE / (1024 * 1024 * 1024)).toFixed(1)}GB`)
        return
      }

      setSelectedFiles(files)
      setTotalSize(size)
      setUploadStatus("idle")
      setErrorMessage(null)
    }
  }, [])

  const handleFolderUpload = useCallback(async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setErrorMessage("Please select dataset files first")
      return
    }

    setIsUploading(true)
    setUploadStatus("uploading")
    setUploadProgress(0)
    setErrorMessage(null)

    try {
      // First, initialize the upload session
      const initResponse = await fetch("/api/dataset/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalFiles: selectedFiles.length,
          totalSize: Array.from(selectedFiles).reduce((sum, file) => sum + file.size, 0),
        }),
      })

      if (!initResponse.ok) {
        throw new Error("Failed to initialize upload")
      }

      const { uploadId } = await initResponse.json()

      // Upload files in chunks of 10 files at a time
      const chunkSize = 10
      const files = Array.from(selectedFiles)
      const totalChunks = Math.ceil(files.length / chunkSize)

      for (let i = 0; i < totalChunks; i++) {
        const chunk = files.slice(i * chunkSize, (i + 1) * chunkSize)
        const formData = new FormData()

        formData.append("uploadId", uploadId)
        formData.append("chunkIndex", i.toString())
        formData.append("totalChunks", totalChunks.toString())

        chunk.forEach((file, index) => {
          formData.append(`file_${index}`, file)
          formData.append(`path_${index}`, file.webkitRelativePath || file.name)
        })

        const response = await fetch("/api/dataset/upload-chunk", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload chunk ${i + 1}`)
        }

        // Update progress
        const progress = Math.round(((i + 1) / totalChunks) * 50) // 50% for upload
        setUploadProgress(progress)
      }

      // Finalize upload
      const finalizeResponse = await fetch("/api/dataset/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadId }),
      })

      if (!finalizeResponse.ok) {
        throw new Error("Failed to finalize upload")
      }

      setUploadStatus("processing")
      setUploadProgress(50)

      // Start polling for processing status
      await pollProcessingStatus(uploadId)
    } catch (error) {
      console.error("Upload error:", error)
      setErrorMessage(error instanceof Error ? error.message : "Upload failed")
      setUploadStatus("error")
    } finally {
      setIsUploading(false)
    }
  }, [selectedFiles])

  const pollProcessingStatus = async (uploadId: string) => {
    const maxAttempts = 60 // 5 minutes max
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`/api/dataset/status/${uploadId}`)
        const data = await response.json()

        if (data.status === "complete") {
          setDatasetStats(data.stats)
          setUploadProgress(100)
          setUploadStatus("complete")

          // Clear localStorage first, then set new values
          localStorage.removeItem("datasetUploaded")
          localStorage.removeItem("datasetStats")

          // Set new dataset info
          localStorage.setItem("datasetUploaded", "true")
          localStorage.setItem("datasetStats", JSON.stringify(data.stats))

          // Trigger a page refresh or navigation to update the main app
          setTimeout(() => {
            window.location.href = "/"
          }, 2000)
        } else if (data.status === "error") {
          throw new Error(data.error || "Processing failed")
        } else if (data.status === "processing") {
          setUploadProgress(50 + (data.progress || 0) * 0.5) // 50-100% for processing
          attempts++
          if (attempts < maxAttempts) {
            setTimeout(poll, 5000) // Poll every 5 seconds
          } else {
            throw new Error("Processing timeout")
          }
        }
      } catch (error) {
        console.error("Status polling error:", error)
        setErrorMessage(error instanceof Error ? error.message : "Processing failed")
        setUploadStatus("error")
      }
    }

    poll()
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFiles(files)
      setUploadStatus("idle")
      setErrorMessage(null)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold">Upload IP102 Dataset</span>
            </div>
            <div />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <Database className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Upload Your IP102 Dataset</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your complete IP102 dataset to enable real pest detection using your own data. The system will
            process and index your images for accurate classification.
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Dataset</TabsTrigger>
            <TabsTrigger value="structure">Dataset Structure</TabsTrigger>
            <TabsTrigger value="status">Upload Status</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-6 h-6" />
                  Select IP102 Dataset Files
                </CardTitle>
                <CardDescription>
                  Choose your IP102 dataset folder or select multiple image files. The system supports various formats
                  and will automatically organize your data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {uploadStatus === "idle" && (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      webkitdirectory=""
                      onChange={handleFileSelection}
                      className="hidden"
                      id="dataset-upload"
                      accept="image/*,.txt,.json,.xml"
                    />
                    <label htmlFor="dataset-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-blue-50 rounded-full">
                          <Upload className="w-12 h-12 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-gray-700 mb-2">
                            Select Dataset Folder or Drop Files Here
                          </p>
                          <p className="text-gray-500">
                            Supports: JPG, PNG, WebP images • Annotation files (TXT, JSON, XML) • Folder structure will
                            be preserved
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                )}

                {selectedFiles && selectedFiles.length > 0 && uploadStatus === "idle" && (
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Selected:</strong> {selectedFiles.length} files (
                        {(totalSize / (1024 * 1024 * 1024)).toFixed(2)}GB) ready for upload
                      </AlertDescription>
                    </Alert>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Dataset Summary:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Files:</span>
                          <span className="font-medium ml-2">{selectedFiles.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Size:</span>
                          <span className="font-medium ml-2">{(totalSize / (1024 * 1024 * 1024)).toFixed(2)}GB</span>
                        </div>
                      </div>

                      <div className="max-h-32 overflow-y-auto text-sm text-gray-600 mt-3">
                        <strong>Sample files:</strong>
                        {Array.from(selectedFiles)
                          .slice(0, 10)
                          .map((file, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{file.webkitRelativePath || file.name}</span>
                              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          ))}
                        {selectedFiles.length > 10 && (
                          <div className="text-gray-500 mt-2">... and {selectedFiles.length - 10} more files</div>
                        )}
                      </div>
                    </div>

                    <Button onClick={handleFolderUpload} className="w-full h-12 text-lg" size="lg">
                      <Database className="w-5 h-5 mr-2" />
                      Upload Dataset ({selectedFiles.length} files, {(totalSize / (1024 * 1024 * 1024)).toFixed(2)}GB)
                    </Button>
                  </div>
                )}

                {(uploadStatus === "uploading" || uploadStatus === "processing") && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 p-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      <div className="text-center">
                        <p className="text-lg font-semibold">
                          {uploadStatus === "uploading" ? "Uploading Dataset..." : "Processing Images..."}
                        </p>
                        <p className="text-gray-600">
                          {uploadStatus === "uploading"
                            ? "Transferring files to server"
                            : "Analyzing and indexing your images"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-3" />
                    </div>
                  </div>
                )}

                {uploadStatus === "complete" && datasetStats && (
                  <div className="space-y-6">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Success!</strong> Your IP102 dataset has been uploaded and processed successfully.
                        Redirecting to home page...
                      </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-3 gap-6">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-blue-600">{datasetStats.totalImages}</div>
                          <div className="text-sm text-gray-600">Total Images</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-green-600">{datasetStats.totalClasses}</div>
                          <div className="text-sm text-gray-600">Pest Classes</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-purple-600">100%</div>
                          <div className="text-sm text-gray-600">Processing Complete</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={() => router.push("/")} className="flex-1">
                        Start Using Dataset
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/dataset")}>
                        View Dataset Info
                      </Button>
                    </div>
                  </div>
                )}

                {uploadStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Error:</strong> {errorMessage}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Expected Dataset Structure</CardTitle>
                <CardDescription>
                  Your IP102 dataset should follow this structure for optimal processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                  <pre>{`IP102/
├── train/
│   ├── class_001/
│   │   ├── image_001.jpg
│   │   ├── image_002.jpg
│   │   └── ...
│   ├── class_002/
│   │   ├── image_001.jpg
│   │   └── ...
│   └── ...
├── val/
│   ├── class_001/
│   │   ├── image_001.jpg
│   │   └── ...
│   └── ...
├── test/
│   ├── class_001/
│   │   ├── image_001.jpg
│   │   └── ...
│   └── ...
└── annotations/
    ├── train_labels.txt
    ├── val_labels.txt
    ├── test_labels.txt
    └── class_names.txt`}</pre>
                </div>

                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold">Supported Formats:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">Image Formats</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• JPEG (.jpg, .jpeg)</li>
                        <li>• PNG (.png)</li>
                        <li>• WebP (.webp)</li>
                        <li>• TIFF (.tiff, .tif)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Annotation Formats</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Text files (.txt)</li>
                        <li>• JSON files (.json)</li>
                        <li>• XML files (.xml)</li>
                        <li>• CSV files (.csv)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Dataset Status</CardTitle>
                <CardDescription>Current status of your uploaded dataset</CardDescription>
              </CardHeader>
              <CardContent>
                {datasetStats ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">Dataset Active</span>
                      <Badge variant="secondary">Ready for Analysis</Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Dataset Statistics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Images:</span>
                            <span className="font-medium">{datasetStats.totalImages}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pest Classes:</span>
                            <span className="font-medium">{datasetStats.totalClasses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Processing Status:</span>
                            <span className="font-medium text-green-600">Complete</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Top Pest Classes</h4>
                        <div className="space-y-2 text-sm">
                          {Object.entries(datasetStats.classDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 5)
                            .map(([className, count]) => (
                              <div key={className} className="flex justify-between">
                                <span>{className}:</span>
                                <span className="font-medium">{count} images</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No dataset uploaded yet</p>
                    <p className="text-sm">Upload your IP102 dataset to see status information</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
