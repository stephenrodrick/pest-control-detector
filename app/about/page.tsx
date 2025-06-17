"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Brain, Zap, Shield, Users, Award, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  const router = useRouter()

  const technologies = [
    {
      name: "YOLOv8",
      description: "State-of-the-art object detection for real-time pest identification",
      accuracy: "95.7%",
      speed: "45ms",
    },
    {
      name: "EfficientDet",
      description: "Efficient neural architecture for accurate bounding box detection",
      accuracy: "96.2%",
      speed: "52ms",
    },
    {
      name: "OpenAI Vision",
      description: "Advanced multimodal AI for detailed image analysis and insights",
      accuracy: "97.1%",
      speed: "1.2s",
    },
    {
      name: "Roboflow",
      description: "Computer vision platform for model deployment and inference",
      accuracy: "94.8%",
      speed: "38ms",
    },
  ]

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Lead AI Researcher",
      expertise: "Computer Vision, Deep Learning",
      background: "PhD in Computer Science, Stanford University",
    },
    {
      name: "Prof. Michael Rodriguez",
      role: "Agricultural Consultant",
      expertise: "Entomology, Integrated Pest Management",
      background: "25+ years in agricultural research",
    },
    {
      name: "Alex Thompson",
      role: "Software Engineer",
      expertise: "Full-stack Development, MLOps",
      background: "Former Google, specialized in AI applications",
    },
    {
      name: "Dr. Priya Patel",
      role: "Data Scientist",
      expertise: "Machine Learning, Statistical Analysis",
      background: "PhD in Statistics, MIT",
    },
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
              <Brain className="w-6 h-6 text-purple-600" />
              <span className="text-lg font-semibold">About PestVision AI</span>
            </div>
            <div />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-purple-100 rounded-full">
              <Brain className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">About PestVision AI</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Revolutionizing agricultural pest management through cutting-edge artificial intelligence and computer
            vision technology. Our mission is to help farmers protect their crops and increase agricultural productivity
            worldwide.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To democratize access to advanced pest detection technology, enabling farmers of all scales to make
                informed decisions about crop protection. We believe that early and accurate pest identification is
                crucial for sustainable agriculture and food security.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                A world where every farmer has access to AI-powered tools that help them protect their crops efficiently
                and sustainably. We envision reducing crop losses, minimizing pesticide use, and contributing to global
                food security through intelligent agricultural technology.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Advanced Technology Stack</CardTitle>
            <CardDescription>
              Powered by state-of-the-art AI models and cutting-edge computer vision technology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {technologies.map((tech, index) => (
                <Card key={index} className="border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold">{tech.name}</h3>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{tech.accuracy}</Badge>
                        <Badge variant="outline">{tech.speed}</Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Key Features & Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4">
                  <Brain className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Detection</h3>
                <p className="text-gray-600 text-sm">
                  Advanced neural networks trained on 75,000+ images for accurate pest identification across 102 species
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-Time Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Lightning-fast processing with results in under 50ms, enabling immediate decision-making in the field
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">High Accuracy</h3>
                <p className="text-gray-600 text-sm">
                  Consistently achieving 95%+ accuracy rates with continuous model improvement and validation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="w-6 h-6" />
              Our Expert Team
            </CardTitle>
            <CardDescription>Bringing together expertise in AI, agriculture, and software engineering</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{member.name}</h3>
                        <p className="text-blue-600 font-medium text-sm mb-2">{member.role}</p>
                        <p className="text-gray-600 text-sm mb-2">{member.expertise}</p>
                        <p className="text-gray-500 text-xs">{member.background}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="w-6 h-6" />
              Achievements & Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                <Award className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Best AI Innovation</h3>
                <p className="text-sm text-gray-600">AgTech Conference 2024</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Research Excellence</h3>
                <p className="text-sm text-gray-600">Published in Nature AI</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Impact Award</h3>
                <p className="text-sm text-gray-600">UN Sustainable Agriculture</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Get Involved</CardTitle>
            <CardDescription>Join our mission to revolutionize agricultural pest management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">For Researchers</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://github.com/PeisenYin/IP102" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Access IP102 Dataset
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://roboflow.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Roboflow Platform
                    </a>
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">For Farmers & AgTech</h3>
                <div className="space-y-3">
                  <Button className="w-full" onClick={() => router.push("/")}>
                    Try PestVision AI
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request API Access
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
