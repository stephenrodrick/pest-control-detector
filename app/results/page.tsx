"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bug, AlertTriangle, CheckCircle, Download, Share2, Eye, Clock, FileText, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface Detection {
  x: number
  y: number
  width: number
  height: number
  confidence: number
  class: string
  class_id: number
  description?: string
  severity?: string
  treatment?: string
}

interface AnalysisResult {
  roboflow: {
    time: number
    image: { width: number; height: number }
    predictions: Detection[]
  }
  openai: {
    description: string
    plant_health: string
    recommendations: string[]
    risk_assessment: string
  }
  imageUrl: string
  fileName: string
  fileSize: number
  timestamp: string
}

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [selectedDetection, setSelectedDetection] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedResult = sessionStorage.getItem("pestAnalysisResult")
    if (storedResult) {
      const parsedResult = JSON.parse(storedResult)
      setResult(parsedResult)

      // Store treatment data for treatment page
      sessionStorage.setItem(
        "treatmentData",
        JSON.stringify({
          detectedPests: parsedResult.roboflow.predictions,
          imageType: parsedResult.imageType || "RGB",
          analysisDate: parsedResult.timestamp,
        }),
      )
    } else {
      router.push("/")
    }
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bug className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  const getPestSeverity = (confidence: number) => {
    if (confidence > 0.8) return { level: "High", color: "destructive" as const, bgColor: "bg-red-50" }
    if (confidence > 0.6) return { level: "Medium", color: "default" as const, bgColor: "bg-yellow-50" }
    return { level: "Low", color: "secondary" as const, bgColor: "bg-green-50" }
  }

  const downloadReport = () => {
    const reportData = {
      analysis_date: new Date(result.timestamp).toLocaleString(),
      image_file: result.fileName,
      detections: result.roboflow.predictions.length,
      ai_insights: result.openai,
      pest_detections: result.roboflow.predictions,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pest-analysis-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Upload
            </Button>
            <div className="flex items-center gap-2">
              <Bug className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold">Analysis Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadReport}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/treatment")}>
                <Leaf className="w-4 h-4 mr-2" />
                Treatment Guide
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Bug className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{result.roboflow.predictions.length}</p>
                  <p className="text-sm text-gray-600">Pests Detected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{result.roboflow.time.toFixed(2)}s</p>
                  <p className="text-sm text-gray-600">Analysis Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Eye className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(Math.max(...result.roboflow.predictions.map((p) => p.confidence)) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Max Confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{(result.fileSize / 1024 / 1024).toFixed(1)}MB</p>
                  <p className="text-sm text-gray-600">Image Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Image Analysis */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Visual Detection Results
                </CardTitle>
                <CardDescription>
                  Analyzed: {result.fileName} • {new Date(result.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative group">
                  <img
                    src={result.imageUrl || "/placeholder.svg"}
                    alt="Analysis result"
                    className="w-full h-auto rounded-lg border shadow-lg"
                  />
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox={`0 0 ${result.roboflow.image.width} ${result.roboflow.image.height}`}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {result.roboflow.predictions.map((detection, index) => {
                      const severity = getPestSeverity(detection.confidence)
                      const isSelected = selectedDetection === index
                      return (
                        <g key={index}>
                          <rect
                            x={detection.x - detection.width / 2}
                            y={detection.y - detection.height / 2}
                            width={detection.width}
                            height={detection.height}
                            fill="none"
                            stroke={isSelected ? "#3b82f6" : "#ef4444"}
                            strokeWidth={isSelected ? "4" : "3"}
                            rx="4"
                            className="cursor-pointer"
                            onClick={() => setSelectedDetection(isSelected ? null : index)}
                          />
                          <rect
                            x={detection.x - detection.width / 2}
                            y={detection.y - detection.height / 2 - 30}
                            width={detection.class.length * 8 + 60}
                            height="25"
                            fill={isSelected ? "#3b82f6" : "#ef4444"}
                            rx="4"
                            className="cursor-pointer"
                            onClick={() => setSelectedDetection(isSelected ? null : index)}
                          />
                          <text
                            x={detection.x - detection.width / 2 + 5}
                            y={detection.y - detection.height / 2 - 10}
                            fill="white"
                            fontSize="12"
                            fontWeight="bold"
                            className="cursor-pointer"
                            onClick={() => setSelectedDetection(isSelected ? null : index)}
                          >
                            {detection.class} ({Math.round(detection.confidence * 100)}%)
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Analysis Complete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Processing Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Complete
                    </Badge>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-sm text-gray-600">
                    Analysis completed in {result.roboflow.time.toFixed(3)} seconds using advanced AI models
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="recommendations">Actions</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Plant Health Assessment</h4>
                      <p className="text-sm text-gray-600">{result.openai.plant_health}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Risk Level</h4>
                      <Badge variant={result.openai.risk_assessment.includes("High") ? "destructive" : "default"}>
                        {result.openai.risk_assessment}
                      </Badge>
                    </div>
                  </TabsContent>
                  <TabsContent value="recommendations" className="space-y-3">
                    {result.openai.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-gray-600">{rec}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Detection Results */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Detected Pests Details</CardTitle>
            <CardDescription>
              Click on any detection box in the image above to highlight the corresponding pest details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.roboflow.predictions.map((detection, index) => {
                const severity = getPestSeverity(detection.confidence)
                const isSelected = selectedDetection === index
                return (
                  <Card
                    key={index}
                    className={`border-l-4 cursor-pointer transition-all ${
                      isSelected ? "border-l-blue-500 bg-blue-50" : "border-l-red-500"
                    } ${severity.bgColor}`}
                    onClick={() => setSelectedDetection(isSelected ? null : index)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            {detection.class}
                            {isSelected && <Eye className="w-4 h-4 text-blue-500" />}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Confidence: {Math.round(detection.confidence * 100)}% • Class ID: {detection.class_id}
                          </p>
                        </div>
                        <Badge variant={severity.color}>{severity.level} Risk</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium mb-1">Location & Size</h5>
                          <p className="text-gray-600">
                            Position: ({Math.round(detection.x)}, {Math.round(detection.y)})<br />
                            Dimensions: {Math.round(detection.width)}×{Math.round(detection.height)}px
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium mb-1">Detection Info</h5>
                          <p className="text-gray-600">
                            Model: Roboflow YOLOv8
                            <br />
                            Processing: {result.roboflow.time.toFixed(3)}s
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Recommendations */}
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Next Steps:</strong> Based on the analysis, we recommend consulting with agricultural experts for
            specific treatment plans. Early intervention is crucial for effective pest management and crop protection.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
