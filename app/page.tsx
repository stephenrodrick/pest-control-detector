"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, Bug, Database, BarChart3, Shield, Zap, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB")
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) {
        const event = { target: { files: [file] } } as any
        handleImageUpload(event)
      }
    },
    [handleImageUpload],
  )

  const analyzePest = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const formData = new FormData()
      formData.append("image", selectedImage)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const result = await response.json()

      // Store result in sessionStorage for the results page
      sessionStorage.setItem(
        "pestAnalysisResult",
        JSON.stringify({
          ...result,
          imageUrl: imagePreview,
          fileName: selectedImage.name,
          fileSize: selectedImage.size,
          timestamp: new Date().toISOString(),
        }),
      )

      setUploadProgress(100)

      // Navigate to results page
      setTimeout(() => {
        router.push("/results")
      }, 500)
    } catch (error) {
      console.error("Analysis error:", error)
      alert("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Bug className="w-8 h-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">PestVision AI</span>
            </div>
            <div className="flex items-center gap-6">
              <Button variant="ghost" onClick={() => router.push("/dataset")}>
                Dataset Info
              </Button>
              <Button variant="ghost" onClick={() => router.push("/documentation")}>
                Documentation
              </Button>
              <Button variant="ghost" onClick={() => router.push("/about")}>
                About
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-full">
              <Bug className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">PestVision AI</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Advanced AI-powered pest detection system supporting RGB and Multispectral imaging using state-of-the-art
            computer vision models trained on the comprehensive IP102 dataset
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>102 Pest Classes</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>95%+ Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Real-time Analysis</span>
            </div>
          </div>
        </div>

        {/* Main Upload Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-dashed border-gray-200 hover:border-green-300 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Upload Plant Image for Analysis</CardTitle>
              <CardDescription className="text-lg">
                Get instant pest detection and identification with confidence scores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-400 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-green-50 rounded-full">
                        <Upload className="w-12 h-12 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-gray-700 mb-2">
                          Drop your image here or click to browse
                        </p>
                        <p className="text-gray-500">
                          Supports JPG, PNG, WebP • RGB & Multispectral Images • Max 10MB • Best results with clear,
                          well-lit images
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative group">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full max-h-96 object-contain rounded-lg border shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{selectedImage?.name}</p>
                      <p className="text-sm text-gray-500">
                        {selectedImage && (selectedImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null)
                        setImagePreview(null)
                      }}
                    >
                      Change Image
                    </Button>
                  </div>

                  {isAnalyzing && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Analyzing image...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  <Button onClick={analyzePest} disabled={isAnalyzing} className="w-full h-12 text-lg" size="lg">
                    {isAnalyzing ? (
                      <>
                        <Brain className="w-5 h-5 mr-2 animate-pulse" />
                        Processing with AI...
                      </>
                    ) : (
                      <>
                        <Bug className="w-5 h-5 mr-2" />
                        Analyze for Pests
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>IP102 Dataset</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Trained on the most comprehensive agricultural pest dataset with 102 distinct pest classes and over
                75,000 high-quality images
              </p>
              <Badge variant="secondary">75,000+ Images</Badge>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>AI-Powered Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Advanced YOLOv8 and EfficientDet models combined with OpenAI Vision for superior accuracy and detailed
                analysis
              </p>
              <Badge variant="secondary">95%+ Accuracy</Badge>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Crop Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Early detection and identification helps prevent crop damage and optimize agricultural productivity
              </p>
              <Badge variant="secondary">Real-time Results</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
