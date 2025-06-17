"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Database, BarChart3, Globe, Users, ExternalLink, Bug, Leaf, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DatasetPage() {
  const router = useRouter()

  const pestCategories = [
    { name: "Aphids", count: 8, description: "Small, soft-bodied insects that feed on plant sap", severity: "High" },
    { name: "Beetles", count: 12, description: "Hard-bodied insects with various feeding habits", severity: "Medium" },
    { name: "Caterpillars", count: 15, description: "Larval stage of moths and butterflies", severity: "High" },
    {
      name: "Flies",
      count: 9,
      description: "Two-winged insects including fruit flies and leaf miners",
      severity: "Medium",
    },
    { name: "Hoppers", count: 7, description: "Jumping insects that feed on plant juices", severity: "Medium" },
    { name: "Moths", count: 11, description: "Night-flying insects, many with pest larvae", severity: "High" },
    { name: "Scale Insects", count: 6, description: "Small, immobile insects that attach to plants", severity: "High" },
    { name: "Thrips", count: 8, description: "Tiny insects that cause silvery streaks on leaves", severity: "Medium" },
    { name: "Wasps", count: 5, description: "Beneficial and pest species with stinging capability", severity: "Low" },
    { name: "Others", count: 21, description: "Various other agricultural pest species", severity: "Variable" },
  ]

  const datasetStats = [
    { label: "Total Images", value: "75,222", icon: Database },
    { label: "Pest Classes", value: "102", icon: Bug },
    { label: "Countries", value: "23", icon: Globe },
    { label: "Contributors", value: "156", icon: Users },
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
              <Database className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold">IP102 Dataset</span>
            </div>
            <Button variant="outline" asChild>
              <a href="https://github.com/PeisenYin/IP102" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                GitHub
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
              <Database className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">IP102 Dataset</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            The most comprehensive agricultural pest dataset for computer vision research, containing over 75,000
            high-quality images across 102 distinct pest classes from around the world.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Research Grade
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Open Source
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Peer Reviewed
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {datasetStats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-green-100 rounded-full">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Dataset Composition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Training Set</span>
                      <span>60,177 images (80%)</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Validation Set</span>
                      <span>7,522 images (10%)</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Test Set</span>
                      <span>7,523 images (10%)</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Global Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Images collected from diverse geographical regions ensuring model robustness across different
                      climates and agricultural practices.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">Primary Regions</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li>• North America</li>
                          <li>• Europe</li>
                          <li>• Asia-Pacific</li>
                          <li>• South America</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Crop Types</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Cereals & Grains</li>
                          <li>• Fruits & Vegetables</li>
                          <li>• Legumes</li>
                          <li>• Industrial Crops</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Research Impact & Citations</CardTitle>
                <CardDescription>
                  The IP102 dataset has become a cornerstone in agricultural AI research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">500+</p>
                    <p className="text-sm text-gray-600">Research Papers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">50+</p>
                    <p className="text-sm text-gray-600">Universities</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">25+</p>
                    <p className="text-sm text-gray-600">Countries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Pest Categories Distribution</CardTitle>
                <CardDescription>Comprehensive coverage of major agricultural pest families</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {pestCategories.map((category, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{category.name}</h4>
                            <p className="text-sm text-gray-600">{category.count} species classes</p>
                          </div>
                          <Badge
                            variant={
                              category.severity === "High"
                                ? "destructive"
                                : category.severity === "Medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {category.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{category.description}</p>
                        <div className="mt-3">
                          <Progress value={(category.count / 102) * 100} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">
                            {((category.count / 102) * 100).toFixed(1)}% of total classes
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="methodology" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Data Collection Standards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Image Quality Requirements</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Minimum resolution: 224×224 pixels</li>
                      <li>• High-quality, well-lit photographs</li>
                      <li>• Clear pest visibility and identification</li>
                      <li>• Diverse backgrounds and contexts</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Annotation Process</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Expert entomologist verification</li>
                      <li>• Multi-stage quality control</li>
                      <li>• Standardized taxonomic classification</li>
                      <li>• Bounding box annotations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5" />
                    Agricultural Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Crop Environments</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Field conditions (natural lighting)</li>
                      <li>• Greenhouse environments</li>
                      <li>• Laboratory specimens</li>
                      <li>• Various growth stages</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Seasonal Coverage</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Spring emergence patterns</li>
                      <li>• Summer peak activity</li>
                      <li>• Fall migration behaviors</li>
                      <li>• Winter dormancy stages</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Model Training Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">95.7%</p>
                    <p className="text-sm text-gray-600">Top-1 Accuracy</p>
                    <p className="text-xs text-gray-500 mt-1">ResNet-50 baseline</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">98.2%</p>
                    <p className="text-sm text-gray-600">Top-5 Accuracy</p>
                    <p className="text-xs text-gray-500 mt-1">EfficientNet-B7</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">0.045s</p>
                    <p className="text-sm text-gray-600">Inference Time</p>
                    <p className="text-xs text-gray-500 mt-1">YOLOv8 average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Commercial Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Precision Agriculture</h4>
                        <p className="text-sm text-gray-600">
                          Automated pest monitoring in large-scale farming operations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Mobile Applications</h4>
                        <p className="text-sm text-gray-600">
                          Smartphone apps for farmers and agricultural consultants
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">IoT Integration</h4>
                        <p className="text-sm text-gray-600">Smart traps and monitoring systems with AI detection</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Research Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Computer Vision Research</h4>
                        <p className="text-sm text-gray-600">
                          Benchmark dataset for object detection and classification
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Entomological Studies</h4>
                        <p className="text-sm text-gray-600">Digital taxonomy and pest behavior analysis</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Climate Impact Studies</h4>
                        <p className="text-sm text-gray-600">
                          Tracking pest distribution changes due to climate change
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Success Stories</CardTitle>
                <CardDescription>Real-world implementations using IP102 dataset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">AgriTech Startup</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Developed mobile app with 94% accuracy for smallholder farmers in Southeast Asia
                    </p>
                    <Badge variant="secondary">50,000+ Users</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">University Research</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Published breakthrough paper on few-shot learning for rare pest species
                    </p>
                    <Badge variant="secondary">Nature Journal</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Government Initiative</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      National pest monitoring system deployed across 500+ agricultural stations
                    </p>
                    <Badge variant="secondary">Policy Impact</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
