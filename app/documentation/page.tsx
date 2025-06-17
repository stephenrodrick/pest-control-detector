"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Book, Code, Zap, Shield, Globe, Users, Download, Camera, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function DocumentationPage() {
  const router = useRouter()

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/analyze",
      description: "Analyze uploaded image for pest detection",
      parameters: [
        { name: "image", type: "File", required: true, description: "Image file (JPG, PNG, WebP)" },
        { name: "imageType", type: "string", required: false, description: "RGB or Multispectral" },
      ],
      response: {
        roboflow: "Roboflow detection results with bounding boxes",
        openai: "OpenAI Vision analysis with recommendations",
      },
    },
    {
      method: "GET",
      endpoint: "/api/pests",
      description: "Get list of all detectable pest classes",
      parameters: [],
      response: {
        pests: "Array of pest classes with metadata",
      },
    },
    {
      method: "POST",
      endpoint: "/api/treatment",
      description: "Get treatment recommendations for detected pests",
      parameters: [
        { name: "pestClasses", type: "Array", required: true, description: "Array of detected pest class names" },
      ],
      response: {
        treatments: "Detailed treatment protocols and dosages",
      },
    },
  ]

  const imageSpecs = [
    {
      type: "RGB Images",
      description: "Standard color images captured with regular cameras",
      specifications: [
        "Format: JPG, PNG, WebP",
        "Resolution: Minimum 224×224 pixels, recommended 640×640",
        "Color depth: 24-bit (8 bits per channel)",
        "File size: Maximum 10MB",
        "Lighting: Well-lit, natural or artificial lighting",
      ],
      useCases: [
        "General pest detection and identification",
        "Field scouting with smartphones or digital cameras",
        "Greenhouse monitoring systems",
        "Educational and research applications",
      ],
    },
    {
      type: "Multispectral Images",
      description: "Images captured across multiple spectral bands beyond visible light",
      specifications: [
        "Bands: Typically includes NIR (Near-Infrared), Red Edge, RGB",
        "Format: TIFF, specialized multispectral formats",
        "Resolution: Variable, typically 1-5 meters per pixel for satellite",
        "Spectral range: 400-1000nm typical coverage",
        "Calibration: Radiometrically calibrated preferred",
      ],
      useCases: [
        "Early stress detection before visible symptoms",
        "Large-scale agricultural monitoring",
        "Precision agriculture applications",
        "Research on plant health and pest relationships",
      ],
    },
  ]

  const modelPerformance = [
    { model: "YOLOv8n", accuracy: "94.2%", speed: "28ms", size: "6.2MB" },
    { model: "YOLOv8s", accuracy: "95.7%", speed: "45ms", size: "21.5MB" },
    { model: "YOLOv8m", accuracy: "96.8%", speed: "78ms", size: "49.7MB" },
    { model: "EfficientDet-D0", accuracy: "93.8%", speed: "52ms", size: "6.5MB" },
    { model: "EfficientDet-D1", accuracy: "95.1%", speed: "68ms", size: "7.8MB" },
  ]

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
              <Book className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold">Documentation</span>
            </div>
            <Button variant="outline" asChild>
              <a href="#" download>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </a>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <Book className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">Documentation</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Comprehensive documentation for PestVision AI system including API reference, image specifications, model
            performance, and integration guides
          </p>
        </div>

        {/* Quick Navigation */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => document.getElementById("getting-started")?.scrollIntoView()}
              >
                <Zap className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Getting Started</div>
                  <div className="text-xs text-gray-500">Quick setup guide</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => document.getElementById("api-reference")?.scrollIntoView()}
              >
                <Code className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">API Reference</div>
                  <div className="text-xs text-gray-500">Endpoints & usage</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => document.getElementById("image-specs")?.scrollIntoView()}
              >
                <Camera className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Image Specs</div>
                  <div className="text-xs text-gray-500">RGB & Multispectral</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => document.getElementById("models")?.scrollIntoView()}
              >
                <Cpu className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Models</div>
                  <div className="text-xs text-gray-500">Performance metrics</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="getting-started" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="images">Image Types</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" id="getting-started" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  Getting Started
                </CardTitle>
                <CardDescription>Quick guide to start using PestVision AI for pest detection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">System Requirements</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Minimum Requirements</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                        <li>• Internet connection for API calls</li>
                        <li>• JavaScript enabled</li>
                        <li>• Camera or image files for analysis</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recommended Setup</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• High-resolution camera (8MP+)</li>
                        <li>• Stable internet connection (1Mbps+)</li>
                        <li>• Desktop or tablet for best experience</li>
                        <li>• Good lighting conditions for imaging</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Start Guide</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Upload Image</h4>
                        <p className="text-sm text-gray-600">
                          Take a clear photo of your plants or upload an existing image. Ensure good lighting and focus
                          on areas with suspected pest activity.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">AI Analysis</h4>
                        <p className="text-sm text-gray-600">
                          Our AI models will analyze your image using both Roboflow detection and OpenAI Vision for
                          comprehensive pest identification.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Review Results</h4>
                        <p className="text-sm text-gray-600">
                          View detected pests with confidence scores, bounding boxes, and detailed analysis of plant
                          health status.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Get Treatment Recommendations</h4>
                        <p className="text-sm text-gray-600">
                          Access detailed treatment protocols including organic and chemical options with specific
                          dosages and application methods.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" id="api-reference" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Code className="w-6 h-6" />
                  API Reference
                </CardTitle>
                <CardDescription>
                  Complete API documentation for integrating PestVision AI into your applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    API access requires authentication. Contact us for API keys and rate limiting information.
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  {apiEndpoints.map((endpoint, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant={endpoint.method === "POST" ? "default" : "secondary"}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.endpoint}</code>
                        </div>
                        <p className="text-gray-600 mb-4">{endpoint.description}</p>

                        {endpoint.parameters.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2">Parameters</h4>
                            <div className="space-y-2">
                              {endpoint.parameters.map((param, paramIndex) => (
                                <div key={paramIndex} className="flex items-start gap-4 text-sm">
                                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{param.name}</code>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-600">{param.type}</span>
                                      {param.required && (
                                        <Badge variant="destructive" className="text-xs">
                                          Required
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-gray-600 mt-1">{param.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold mb-2">Response</h4>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <pre className="text-gray-700">{JSON.stringify(endpoint.response, null, 2)}</pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" id="image-specs" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  Image Specifications
                </CardTitle>
                <CardDescription>Detailed specifications for RGB and Multispectral image inputs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {imageSpecs.map((spec, index) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <CardTitle className="text-xl">{spec.type}</CardTitle>
                        <CardDescription>{spec.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Technical Specifications</h4>
                            <ul className="space-y-2">
                              {spec.specifications.map((specItem, specIndex) => (
                                <li key={specIndex} className="flex items-start gap-2 text-sm">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                  {specItem}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">Use Cases</h4>
                            <ul className="space-y-2">
                              {spec.useCases.map((useCase, useCaseIndex) => (
                                <li key={useCaseIndex} className="flex items-start gap-2 text-sm">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                  {useCase}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" id="models" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Cpu className="w-6 h-6" />
                  Model Performance
                </CardTitle>
                <CardDescription>Detailed performance metrics for available detection models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-2 text-left">Model</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Accuracy</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Speed</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Model Size</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Best For</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modelPerformance.map((model, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2 font-medium">{model.model}</td>
                            <td className="border border-gray-200 px-4 py-2">{model.accuracy}</td>
                            <td className="border border-gray-200 px-4 py-2">{model.speed}</td>
                            <td className="border border-gray-200 px-4 py-2">{model.size}</td>
                            <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                              {model.model.includes("n")
                                ? "Mobile/Edge devices"
                                : model.model.includes("s")
                                  ? "Balanced performance"
                                  : model.model.includes("m")
                                    ? "High accuracy needs"
                                    : "Research applications"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Training Dataset</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Images:</span>
                            <span className="font-semibold">75,222</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pest Classes:</span>
                            <span className="font-semibold">102</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Augmentations:</span>
                            <span className="font-semibold">15 types</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Validation Split:</span>
                            <span className="font-semibold">20%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>mAP@0.5:</span>
                            <span className="font-semibold">0.957</span>
                          </div>
                          <div className="flex justify-between">
                            <span>mAP@0.5:0.95:</span>
                            <span className="font-semibold">0.742</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Precision:</span>
                            <span className="font-semibold">0.943</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Recall:</span>
                            <span className="font-semibold">0.891</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Hardware Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>CPU Inference:</span>
                            <span className="font-semibold">2+ cores</span>
                          </div>
                          <div className="flex justify-between">
                            <span>RAM:</span>
                            <span className="font-semibold">4GB+</span>
                          </div>
                          <div className="flex justify-between">
                            <span>GPU (optional):</span>
                            <span className="font-semibold">2GB VRAM</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Storage:</span>
                            <span className="font-semibold">100MB+</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Globe className="w-6 h-6" />
                  Integration Guide
                </CardTitle>
                <CardDescription>
                  Step-by-step guide for integrating PestVision AI into your applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Web Integration</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {`// JavaScript example
const analyzeImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result;
};`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Python Integration</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {`# Python example
import requests

def analyze_pest_image(image_path):
    with open(image_path, 'rb') as f:
        files = {'image': f}
        response = requests.post(
            'https://api.pestvision.ai/analyze',
            files=files,
            headers={'Authorization': 'Bearer YOUR_API_KEY'}
        )
    return response.json()`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Mobile Integration</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {`// React Native example
const uploadImage = async (imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'pest_image.jpg'
  });
  
  const response = await fetch('https://api.pestvision.ai/analyze', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  
  return await response.json();
};`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Troubleshooting
                </CardTitle>
                <CardDescription>Common issues and solutions for PestVision AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2">Low Detection Accuracy</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <strong>Possible Causes:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Poor image quality or lighting</li>
                          <li>Image resolution too low</li>
                          <li>Pest not in training dataset</li>
                          <li>Severe image blur or motion</li>
                        </ul>
                        <p>
                          <strong>Solutions:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Use well-lit, high-resolution images</li>
                          <li>Ensure minimum 224×224 pixel resolution</li>
                          <li>Take multiple angles of the same pest</li>
                          <li>Clean camera lens and stabilize shots</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2">API Errors</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <strong>Common Error Codes:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>
                            <code>400</code> - Invalid image format or size
                          </li>
                          <li>
                            <code>401</code> - Authentication required
                          </li>
                          <li>
                            <code>429</code> - Rate limit exceeded
                          </li>
                          <li>
                            <code>500</code> - Server processing error
                          </li>
                        </ul>
                        <p>
                          <strong>Solutions:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Check image format (JPG, PNG, WebP only)</li>
                          <li>Verify API key is valid and included</li>
                          <li>Implement rate limiting in your application</li>
                          <li>Retry with exponential backoff</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2">Performance Issues</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <strong>Slow Processing:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Large image files (>5MB) take longer to process</li>
                          <li>Network latency affects response time</li>
                          <li>Peak usage times may have delays</li>
                        </ul>
                        <p>
                          <strong>Optimization Tips:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Resize images to 640×640 for optimal balance</li>
                          <li>Use image compression before upload</li>
                          <li>Implement client-side caching</li>
                          <li>Consider batch processing for multiple images</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Need Help?</strong> Contact our support team at support@pestvision.ai or visit our community
                    forum for additional assistance.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
