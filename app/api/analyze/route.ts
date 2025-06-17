import { type NextRequest, NextResponse } from "next/server"

// Mock function to analyze image characteristics for dynamic results
function analyzeImageCharacteristics(imageBuffer: Buffer, fileName: string) {
  // Simple analysis based on file size and random factors
  const fileSize = imageBuffer.length
  const complexity = Math.min(fileSize / (1024 * 1024), 5) // 0-5 scale based on MB

  // Detect image type based on filename or content
  const isMultispectral =
    fileName.toLowerCase().includes("multispectral") ||
    fileName.toLowerCase().includes("nir") ||
    fileName.toLowerCase().includes("ndvi") ||
    fileSize > 5 * 1024 * 1024 // Assume large files might be multispectral

  // Generate characteristics that affect pest detection
  return {
    brightness: Math.random() * 0.4 + 0.3, // 0.3-0.7
    leafDensity: Math.random() * 0.6 + 0.2, // 0.2-0.8
    imageQuality: Math.min(complexity * 0.2 + 0.6, 1), // 0.6-1.0
    pestProbability: Math.random() * 0.8 + 0.1, // 0.1-0.9
    imageType: isMultispectral ? "Multispectral" : "RGB",
    spectralBands: isMultispectral ? ["RGB", "NIR", "Red Edge"] : ["RGB"],
  }
}

function generateDynamicDetections(characteristics: any) {
  const { brightness, leafDensity, imageQuality, pestProbability, imageType } = characteristics

  // Multispectral images might detect different or additional pests
  const detectionBonus = imageType === "Multispectral" ? 0.2 : 0

  // Determine number of detections based on characteristics
  let numDetections = 0
  const adjustedProbability = Math.min(pestProbability + detectionBonus, 1)

  if (adjustedProbability > 0.7)
    numDetections = Math.floor(Math.random() * 3) + 2 // 2-4
  else if (adjustedProbability > 0.4)
    numDetections = Math.floor(Math.random() * 2) + 1 // 1-2
  else if (adjustedProbability > 0.2) numDetections = Math.random() > 0.5 ? 1 : 0 // 0-1

  const pestTypes = [
    { name: "Aphid", severity: "High", commonness: 0.8, multispectralBonus: 0.1 },
    { name: "Whitefly", severity: "Medium", commonness: 0.6, multispectralBonus: 0.15 },
    { name: "Thrips", severity: "Medium", commonness: 0.5, multispectralBonus: 0.1 },
    { name: "Spider Mite", severity: "High", commonness: 0.4, multispectralBonus: 0.2 },
    { name: "Scale Insect", severity: "High", commonness: 0.3, multispectralBonus: 0.05 },
    { name: "Leaf Miner", severity: "Medium", commonness: 0.4, multispectralBonus: 0.25 },
    { name: "Caterpillar", severity: "High", commonness: 0.5, multispectralBonus: 0.1 },
    { name: "Beetle", severity: "Medium", commonness: 0.3, multispectralBonus: 0.05 },
    { name: "Mealybug", severity: "High", commonness: 0.2, multispectralBonus: 0.1 },
    { name: "Leafhopper", severity: "Medium", commonness: 0.3, multispectralBonus: 0.15 },
  ]

  const detections = []
  const usedPests = new Set()

  for (let i = 0; i < numDetections; i++) {
    // Select pest type based on commonness and image characteristics
    let selectedPest
    let attempts = 0
    do {
      const weightedPests = pestTypes.filter((p) => {
        if (usedPests.has(p.name)) return false
        let probability = p.commonness * adjustedProbability
        if (imageType === "Multispectral") {
          probability += p.multispectralBonus
        }
        return Math.random() < probability
      })
      selectedPest =
        weightedPests.length > 0
          ? weightedPests[Math.floor(Math.random() * weightedPests.length)]
          : pestTypes[Math.floor(Math.random() * pestTypes.length)]
      attempts++
    } while (usedPests.has(selectedPest.name) && attempts < 10)

    usedPests.add(selectedPest.name)

    // Generate confidence based on image quality and pest characteristics
    let baseConfidence = imageQuality * 0.4 + 0.4 // 0.4-0.8 base
    if (brightness < 0.4 || brightness > 0.8) baseConfidence *= 0.9 // Reduce for poor lighting
    if (leafDensity > 0.7) baseConfidence *= 0.95 // Reduce for dense foliage
    if (imageType === "Multispectral") baseConfidence *= 1.1 // Boost for multispectral

    const confidence = Math.min(baseConfidence + (Math.random() * 0.2 - 0.1), 0.98)

    // Generate realistic bounding box coordinates
    const x = Math.random() * 400 + 120 // 120-520
    const y = Math.random() * 300 + 90 // 90-390
    const width = Math.random() * 80 + 40 // 40-120
    const height = Math.random() * 60 + 30 // 30-90

    detections.push({
      x,
      y,
      width,
      height,
      confidence,
      class: selectedPest.name,
      class_id: Math.floor(Math.random() * 102),
    })
  }

  return detections
}

function generateOpenAIInsights(detections: any[], characteristics: any) {
  const { brightness, leafDensity, imageQuality, pestProbability, imageType, spectralBands } = characteristics

  let plantHealth = "Good"
  let riskAssessment = "Low Risk"
  let recommendations = [
    "Continue regular monitoring of crop health",
    "Maintain current integrated pest management practices",
  ]

  // Enhanced analysis for multispectral images
  if (imageType === "Multispectral") {
    recommendations.push("Multispectral analysis provides enhanced early detection capabilities")
    recommendations.push("Monitor NDVI values for plant stress indicators")
  }

  if (detections.length > 0) {
    const highConfidenceDetections = detections.filter((d) => d.confidence > 0.8)
    const pestNames = [...new Set(detections.map((d) => d.class))]

    if (detections.length >= 3 || highConfidenceDetections.length >= 2) {
      plantHealth = "At Risk - Multiple pest species detected"
      riskAssessment = "High Risk"
      recommendations = [
        "Immediate intervention recommended - consult with agricultural extension services",
        "Consider targeted pesticide application for detected pest species",
        "Increase monitoring frequency to weekly inspections",
        "Implement biological control methods where appropriate",
        "Document pest population trends for future reference",
      ]
    } else if (detections.length >= 2) {
      plantHealth = "Moderate Concern - Pest activity detected"
      riskAssessment = "Medium Risk"
      recommendations = [
        "Monitor pest population development closely",
        "Consider preventive measures to avoid population explosion",
        "Evaluate need for targeted treatment in affected areas",
        "Increase scouting frequency in surrounding areas",
      ]
    } else {
      plantHealth = "Minor Concern - Low-level pest presence"
      riskAssessment = "Low to Medium Risk"
      recommendations = [
        "Continue monitoring - early detection is key",
        "Consider preventive biological control measures",
        "Document location and timing for trend analysis",
        "No immediate treatment necessary but stay vigilant",
      ]
    }

    // Add pest-specific recommendations
    if (pestNames.includes("Aphid")) {
      recommendations.push("For aphids: Consider introducing beneficial insects like ladybugs")
    }
    if (pestNames.includes("Spider Mite")) {
      recommendations.push("For spider mites: Increase humidity and consider predatory mites")
    }
    if (pestNames.includes("Whitefly")) {
      recommendations.push("For whiteflies: Use yellow sticky traps and consider neem oil treatment")
    }
    if (pestNames.includes("Leaf Miner")) {
      recommendations.push("For leaf miners: Remove affected leaves and consider beneficial parasitoids")
    }
  }

  // Adjust based on image characteristics
  if (imageQuality < 0.7) {
    recommendations.push("Note: Image quality affects detection accuracy - use clear, well-lit photos for best results")
  }

  if (imageType === "Multispectral") {
    recommendations.push("Multispectral data enables detection of stress before visible symptoms appear")
  }

  return {
    description: `Analysis of uploaded ${imageType.toLowerCase()} crop image reveals ${detections.length} pest detection(s). Image quality: ${(imageQuality * 100).toFixed(0)}%, lighting conditions: ${brightness > 0.6 ? "good" : brightness > 0.4 ? "moderate" : "poor"}, vegetation density: ${leafDensity > 0.6 ? "high" : leafDensity > 0.3 ? "moderate" : "low"}. Spectral bands analyzed: ${spectralBands.join(", ")}.`,
    plant_health: plantHealth,
    recommendations,
    risk_assessment: riskAssessment,
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to buffer for analysis
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Analyze image characteristics for dynamic results
    const characteristics = analyzeImageCharacteristics(buffer, image.name)

    // Generate dynamic detections based on image characteristics
    const predictions = generateDynamicDetections(characteristics)

    // Simulate processing time based on image complexity and type
    const baseProcessingTime = characteristics.imageType === "Multispectral" ? 0.08 : 0.05
    const processingTime = Math.random() * baseProcessingTime + 0.02 // 0.02-0.07 seconds for RGB, 0.02-0.10 for multispectral
    await new Promise((resolve) => setTimeout(resolve, processingTime * 1000))

    // Generate Roboflow-style response
    const roboflowResult = {
      time: processingTime,
      image: { width: 640, height: 480 },
      predictions,
    }

    // Generate OpenAI Vision insights
    const openaiResult = generateOpenAIInsights(predictions, characteristics)

    // In a real implementation, you would make actual API calls:
    /*
    // Roboflow API call
    const roboflowResponse = await fetch(`https://detect.roboflow.com/your-model-id/1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${process.env.ROBOFLOW_API_KEY}`
      },
      body: `image=${base64Image}&confidence=0.5&overlap=0.3`
    })
    
    // OpenAI Vision API call
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [{
          role: "user",
          content: [{
            type: "text",
            text: "Analyze this crop image for pest damage and provide agricultural recommendations. If this is a multispectral image, provide enhanced analysis using spectral data."
          }, {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64Image}` }
          }]
        }],
        max_tokens: 500
      })
    })
    */

    return NextResponse.json({
      roboflow: roboflowResult,
      openai: openaiResult,
      imageType: characteristics.imageType,
      spectralBands: characteristics.spectralBands,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 })
  }
}
