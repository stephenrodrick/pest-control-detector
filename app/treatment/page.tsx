"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Leaf, Droplets, Shield, AlertTriangle, Clock, Beaker, Target, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TreatmentData {
  detectedPests: Array<{
    class: string
    confidence: number
    class_id: number
  }>
  imageType: string
  analysisDate: string
}

interface TreatmentProtocol {
  pestName: string
  prevention: {
    cultural: string[]
    biological: string[]
    mechanical: string[]
  }
  treatment: {
    organic: Array<{
      name: string
      dosage: string
      application: string
      frequency: string
      timing: string
    }>
    chemical: Array<{
      name: string
      activeIngredient: string
      dosage: string
      application: string
      frequency: string
      preharvest: string
      safety: string
    }>
  }
  monitoring: {
    frequency: string
    methods: string[]
    thresholds: string
  }
}

export default function TreatmentPage() {
  const [treatmentData, setTreatmentData] = useState<TreatmentData | null>(null)
  const [selectedPest, setSelectedPest] = useState<string | null>(null)
  const router = useRouter()

  const treatmentProtocols: Record<string, TreatmentProtocol> = {
    Aphid: {
      pestName: "Aphid",
      prevention: {
        cultural: [
          "Plant resistant varieties when available",
          "Maintain proper plant spacing for air circulation",
          "Avoid excessive nitrogen fertilization",
          "Remove weeds that serve as alternate hosts",
          "Use reflective mulches to deter aphids",
          "Rotate crops to break pest cycles",
          "Monitor plants regularly for early detection",
        ],
        biological: [
          "Encourage beneficial insects (ladybugs, lacewings, parasitic wasps)",
          "Plant companion crops like marigolds, catnip, or garlic",
          "Maintain habitat for natural predators",
          "Release commercially available beneficial insects",
          "Use banker plants to support beneficial populations",
        ],
        mechanical: [
          "Use yellow sticky traps for monitoring",
          "Apply strong water sprays to dislodge aphids",
          "Install row covers during vulnerable growth stages",
          "Regular inspection and manual removal of colonies",
          "Aluminum foil mulch to confuse aphids",
        ],
      },
      treatment: {
        organic: [
          {
            name: "Neem Oil",
            dosage: "2-4 tablespoons per gallon of water (15-30ml/L)",
            application: "Foliar spray covering all plant surfaces",
            frequency: "Every 7-14 days",
            timing: "Early morning or evening to avoid leaf burn",
          },
          {
            name: "Insecticidal Soap",
            dosage: "2-3 tablespoons per gallon (15-22ml/L)",
            application: "Direct spray on aphid colonies",
            frequency: "Every 5-7 days as needed",
            timing: "When temperatures are below 80°F (27°C)",
          },
          {
            name: "Pyrethrin",
            dosage: "Follow label instructions (typically 1-2ml/L)",
            application: "Targeted spray on infested areas",
            frequency: "As needed, maximum 3 applications per season",
            timing: "Late evening to protect beneficial insects",
          },
          {
            name: "Diatomaceous Earth",
            dosage: "Light dusting on affected plants",
            application: "Apply dry powder to plant surfaces",
            frequency: "Reapply after rain or irrigation",
            timing: "Early morning when dew is present",
          },
        ],
        chemical: [
          {
            name: "Imidacloprid",
            activeIngredient: "Imidacloprid 17.8%",
            dosage: "0.5-1.0ml per liter of water",
            application: "Soil drench or foliar spray",
            frequency: "Once per season (systemic)",
            preharvest: "21 days",
            safety: "Wear protective equipment, avoid during bloom",
          },
          {
            name: "Acetamiprid",
            activeIngredient: "Acetamiprid 20%",
            dosage: "0.2-0.4g per liter of water",
            application: "Foliar spray",
            frequency: "Maximum 2 applications per season",
            preharvest: "14 days",
            safety: "Do not apply during windy conditions",
          },
        ],
      },
      monitoring: {
        frequency: "Weekly during growing season",
        methods: ["Visual inspection of new growth", "Yellow sticky traps", "Shake test on branches"],
        thresholds: "Treatment when 10% of plants show colonies or 5+ aphids per leaf",
      },
    },
    Whitefly: {
      pestName: "Whitefly",
      prevention: {
        cultural: [
          "Use resistant varieties when available",
          "Maintain proper plant spacing",
          "Remove plant debris and weeds",
          "Avoid over-fertilization with nitrogen",
          "Use UV-reflective mulches",
          "Quarantine new plants before introduction",
        ],
        biological: [
          "Encourage natural enemies (Encarsia wasps, Delphastus beetles)",
          "Plant trap crops like nasturtiums",
          "Maintain diverse habitat for beneficial insects",
          "Release commercially available biocontrol agents",
          "Use banker plants for parasitoid wasps",
        ],
        mechanical: [
          "Install yellow sticky traps",
          "Use fine mesh screens in greenhouses",
          "Vacuum adults in early morning when sluggish",
          "Remove heavily infested leaves",
          "Use reflective mulches to confuse whiteflies",
        ],
      },
      treatment: {
        organic: [
          {
            name: "Horticultural Oil",
            dosage: "2-4 tablespoons per gallon (15-30ml/L)",
            application: "Thorough coverage of leaf undersides",
            frequency: "Every 7-10 days",
            timing: "Early morning or late evening",
          },
          {
            name: "Beauveria bassiana",
            dosage: "1-2 teaspoons per gallon (2.5-5ml/L)",
            application: "Foliar spray targeting adults and nymphs",
            frequency: "Every 5-7 days",
            timing: "High humidity conditions preferred",
          },
          {
            name: "Neem Oil",
            dosage: "2-3 tablespoons per gallon (15-22ml/L)",
            application: "Complete plant coverage",
            frequency: "Every 7-14 days",
            timing: "Evening application preferred",
          },
        ],
        chemical: [
          {
            name: "Spiromesifen",
            activeIngredient: "Spiromesifen 22.9%",
            dosage: "0.75-1.5ml per liter",
            application: "Foliar spray with good coverage",
            frequency: "Maximum 2 applications per season",
            preharvest: "7 days",
            safety: "Rotate with different mode of action",
          },
          {
            name: "Pyriproxyfen",
            activeIngredient: "Pyriproxyfen 10.8%",
            dosage: "0.5-1.0ml per liter",
            application: "Foliar spray targeting nymphs",
            frequency: "1-2 applications per season",
            preharvest: "14 days",
            safety: "Growth regulator, targets immature stages",
          },
        ],
      },
      monitoring: {
        frequency: "Twice weekly during warm weather",
        methods: ["Yellow sticky traps", "Leaf tapping", "Visual inspection"],
        thresholds: "Treatment at 1 adult per trap per day or 5+ nymphs per leaf",
      },
    },
    Thrips: {
      pestName: "Thrips",
      prevention: {
        cultural: [
          "Remove weeds and plant debris",
          "Use drip irrigation to reduce humidity",
          "Maintain proper plant nutrition",
          "Avoid dusty conditions",
          "Plant windbreaks to reduce thrips migration",
          "Use clean planting material",
        ],
        biological: [
          "Encourage predatory mites and minute pirate bugs",
          "Use banker plants for beneficial insects",
          "Apply beneficial nematodes to soil",
          "Maintain flowering plants for natural enemies",
          "Release Amblyseius cucumeris (predatory mites)",
        ],
        mechanical: [
          "Use blue sticky traps (more attractive than yellow)",
          "Install thrips-proof screens",
          "Regular pruning of damaged tissue",
          "Reflective mulches to confuse thrips",
          "Remove flower debris regularly",
        ],
      },
      treatment: {
        organic: [
          {
            name: "Spinosad",
            dosage: "4-8ml per gallon (1-2ml/L)",
            application: "Foliar spray with thorough coverage",
            frequency: "Every 7-10 days",
            timing: "Late evening to protect beneficial insects",
          },
          {
            name: "Predatory Mites",
            dosage: "50-100 mites per square meter",
            application: "Release on plants",
            frequency: "2-3 releases per season",
            timing: "When thrips first detected",
          },
          {
            name: "Insecticidal Soap",
            dosage: "2-3 tablespoons per gallon (15-22ml/L)",
            application: "Direct spray on thrips",
            frequency: "Every 5-7 days",
            timing: "Early morning or evening",
          },
        ],
        chemical: [
          {
            name: "Abamectin",
            activeIngredient: "Abamectin 1.8%",
            dosage: "0.5-1.0ml per liter",
            application: "Foliar spray targeting larvae",
            frequency: "Maximum 2 applications per season",
            preharvest: "14 days",
            safety: "Highly toxic to beneficial insects",
          },
          {
            name: "Spinetoram",
            activeIngredient: "Spinetoram 11.7%",
            dosage: "0.5-1.0ml per liter",
            application: "Foliar spray",
            frequency: "Maximum 3 applications per season",
            preharvest: "7 days",
            safety: "Less harmful to beneficial insects than abamectin",
          },
        ],
      },
      monitoring: {
        frequency: "Weekly monitoring with traps",
        methods: ["Blue sticky traps", "Flower tapping", "Leaf inspection"],
        thresholds: "Treatment at 5+ thrips per trap per week or visible damage",
      },
    },
    "Spider Mite": {
      pestName: "Spider Mite",
      prevention: {
        cultural: [
          "Maintain adequate soil moisture",
          "Increase humidity around plants",
          "Avoid dusty conditions",
          "Proper plant nutrition (avoid excess nitrogen)",
          "Remove heavily infested plant material",
          "Provide adequate plant spacing",
        ],
        biological: [
          "Encourage predatory mites and ladybugs",
          "Maintain diverse plant communities",
          "Avoid broad-spectrum pesticides",
          "Use banker plants for beneficial mites",
          "Release Phytoseiulus persimilis",
        ],
        mechanical: [
          "Regular water sprays to increase humidity",
          "Pruning of heavily infested branches",
          "Reflective mulches",
          "Proper plant spacing for air circulation",
          "Remove dust from plant surfaces",
        ],
      },
      treatment: {
        organic: [
          {
            name: "Predatory Mites (Phytoseiulus persimilis)",
            dosage: "2-5 mites per infested leaf",
            application: "Release directly on plants",
            frequency: "2-3 releases at 2-week intervals",
            timing: "When spider mites first detected",
          },
          {
            name: "Horticultural Oil",
            dosage: "1-2 tablespoons per gallon (7.5-15ml/L)",
            application: "Thorough spray of leaf undersides",
            frequency: "Every 5-7 days",
            timing: "Cool parts of the day",
          },
          {
            name: "Neem Oil",
            dosage: "2-3 tablespoons per gallon (15-22ml/L)",
            application: "Complete plant coverage",
            frequency: "Every 7-10 days",
            timing: "Evening application",
          },
        ],
        chemical: [
          {
            name: "Bifenazate",
            activeIngredient: "Bifenazate 22.1%",
            dosage: "1.0-1.5ml per liter",
            application: "Foliar spray with excellent coverage",
            frequency: "Maximum 2 applications per season",
            preharvest: "3 days",
            safety: "Selective miticide, less harmful to beneficials",
          },
          {
            name: "Hexythiazox",
            activeIngredient: "Hexythiazox 10%",
            dosage: "0.5-1.0ml per liter",
            application: "Foliar spray targeting eggs and juveniles",
            frequency: "1-2 applications per season",
            preharvest: "7 days",
            safety: "Ovicide and juvenile growth inhibitor",
          },
        ],
      },
      monitoring: {
        frequency: "Weekly during hot, dry weather",
        methods: ["Leaf inspection with hand lens", "Tap test", "Webbing observation"],
        thresholds: "Treatment at 5+ mites per leaf or first sign of webbing",
      },
    },
    "Scale Insect": {
      pestName: "Scale Insect",
      prevention: {
        cultural: [
          "Quarantine new plants",
          "Maintain plant vigor through proper care",
          "Avoid over-fertilization",
          "Prune overcrowded branches",
          "Regular cleaning of plant surfaces",
          "Proper plant spacing",
        ],
        biological: [
          "Encourage parasitic wasps and predatory beetles",
          "Maintain ant control (ants protect scales)",
          "Use beneficial fungi applications",
          "Plant diverse species to support natural enemies",
          "Release Metaphycus helvolus (parasitic wasp)",
        ],
        mechanical: [
          "Regular inspection and manual removal",
          "Pruning of heavily infested branches",
          "Alcohol swabs for small infestations",
          "Sticky bands on tree trunks",
          "High-pressure water sprays",
        ],
      },
      treatment: {
        organic: [
          {
            name: "Horticultural Oil",
            dosage: "2-4 tablespoons per gallon (15-30ml/L)",
            application: "Thorough coverage during dormant season",
            frequency: "2-3 applications at 2-week intervals",
            timing: "Dormant season or crawler stage",
          },
          {
            name: "Insecticidal Soap",
            dosage: "2-3 tablespoons per gallon (15-22ml/L)",
            application: "Target crawler stage",
            frequency: "Weekly during crawler emergence",
            timing: "When crawlers are active",
          },
          {
            name: "Neem Oil",
            dosage: "2-4 tablespoons per gallon (15-30ml/L)",
            application: "Complete plant coverage",
            frequency: "Every 7-14 days",
            timing: "During crawler stage",
          },
        ],
        chemical: [
          {
            name: "Buprofezin",
            activeIngredient: "Buprofezin 25%",
            dosage: "1.0-2.0ml per liter",
            application: "Foliar spray during crawler stage",
            frequency: "1-2 applications per season",
            preharvest: "14 days",
            safety: "Target crawler stage for best efficacy",
          },
          {
            name: "Spirotetramat",
            activeIngredient: "Spirotetramat 22.4%",
            dosage: "0.75-1.5ml per liter",
            application: "Soil drench or foliar spray",
            frequency: "1-2 applications per season",
            preharvest: "7 days",
            safety: "Systemic action, effective against all stages",
          },
        ],
      },
      monitoring: {
        frequency: "Monthly inspection",
        methods: ["Visual inspection", "Sticky traps for crawlers", "Degree-day monitoring"],
        thresholds: "Treatment when crawlers detected or 10% branch coverage",
      },
    },
    "Leaf Miner": {
      pestName: "Leaf Miner",
      prevention: {
        cultural: [
          "Remove and destroy infested leaves",
          "Use crop rotation to break life cycles",
          "Maintain proper plant nutrition",
          "Avoid over-fertilization with nitrogen",
          "Use clean cultivation practices",
          "Remove plant debris after harvest",
        ],
        biological: [
          "Encourage parasitic wasps (Diglyphus isaea)",
          "Maintain habitat for beneficial insects",
          "Use trap crops to concentrate pests",
          "Release commercially available parasitoids",
          "Avoid broad-spectrum insecticides",
        ],
        mechanical: [
          "Use row covers during egg-laying period",
          "Yellow sticky traps for adult monitoring",
          "Regular removal of mined leaves",
          "Reflective mulches to deter adults",
          "Hand-picking of infested leaves",
        ],
      },
      treatment: {
        organic: [
          {
            name: "Spinosad",
            dosage: "4-8ml per gallon (1-2ml/L)",
            application: "Foliar spray targeting larvae in mines",
            frequency: "Every 7-10 days",
            timing: "When larvae are actively feeding",
          },
          {
            name: "Neem Oil",
            dosage: "2-3 tablespoons per gallon (15-22ml/L)",
            application: "Systemic uptake through roots",
            frequency: "Every 10-14 days",
            timing: "Soil drench or foliar application",
          },
          {
            name: "Beneficial Nematodes",
            dosage: "50 million per square meter",
            application: "Soil application around plants",
            frequency: "2-3 applications per season",
            timing: "When pupae are in soil",
          },
        ],
        chemical: [
          {
            name: "Cyromazine",
            activeIngredient: "Cyromazine 75%",
            dosage: "0.2-0.4g per liter",
            application: "Foliar spray or soil drench",
            frequency: "Maximum 2 applications per season",
            preharvest: "14 days",
            safety: "Insect growth regulator, low mammalian toxicity",
          },
          {
            name: "Abamectin",
            activeIngredient: "Abamectin 1.8%",
            dosage: "0.5-1.0ml per liter",
            application: "Foliar spray with penetrating surfactant",
            frequency: "Maximum 2 applications per season",
            preharvest: "7 days",
            safety: "Highly effective against larvae in mines",
          },
        ],
      },
      monitoring: {
        frequency: "Weekly during active growing season",
        methods: ["Visual inspection for mines", "Yellow sticky traps", "Leaf sampling"],
        thresholds: "Treatment at 10% leaf damage or 2+ mines per leaf",
      },
    },
    Caterpillar: {
      pestName: "Caterpillar",
      prevention: {
        cultural: [
          "Use pheromone traps for adult moths",
          "Maintain clean cultivation",
          "Remove crop residues after harvest",
          "Use resistant varieties when available",
          "Proper timing of planting to avoid peak flights",
          "Deep plowing to destroy pupae",
        ],
        biological: [
          "Encourage natural predators (birds, spiders, ground beetles)",
          "Use Trichogramma wasps for egg parasitism",
          "Apply Bacillus thuringiensis (Bt)",
          "Maintain diverse habitat for beneficial insects",
          "Use nuclear polyhedrosis virus (NPV)",
        ],
        mechanical: [
          "Hand-picking of caterpillars and egg masses",
          "Use of pheromone traps for monitoring",
          "Light traps for adult moths",
          "Barrier methods (tree bands, collars)",
          "Regular inspection of plants",
        ],
      },
      treatment: {
        organic: [
          {
            name: "Bacillus thuringiensis (Bt)",
            dosage: "1-2 tablespoons per gallon (7.5-15ml/L)",
            application: "Foliar spray targeting young larvae",
            frequency: "Every 5-7 days as needed",
            timing: "When larvae are small and actively feeding",
          },
          {
            name: "Spinosad",
            dosage: "4-8ml per gallon (1-2ml/L)",
            application: "Foliar spray with good coverage",
            frequency: "Every 7-10 days",
            timing: "Target young larvae for best results",
          },
          {
            name: "Neem Oil",
            dosage: "2-4 tablespoons per gallon (15-30ml/L)",
            application: "Foliar spray affecting feeding and growth",
            frequency: "Every 7-14 days",
            timing: "Early morning or evening application",
          },
        ],
        chemical: [
          {
            name: "Chlorantraniliprole",
            activeIngredient: "Chlorantraniliprole 18.5%",
            dosage: "0.3-0.6ml per liter",
            application: "Foliar spray or soil application",
            frequency: "Maximum 2 applications per season",
            preharvest: "3 days",
            safety: "Low toxicity to beneficial insects",
          },
          {
            name: "Emamectin benzoate",
            activeIngredient: "Emamectin benzoate 5%",
            dosage: "0.4-0.8g per liter",
            application: "Foliar spray with good penetration",
            frequency: "Maximum 2 applications per season",
            preharvest: "7 days",
            safety: "Highly effective against lepidopteran larvae",
          },
        ],
      },
      monitoring: {
        frequency: "Weekly during growing season",
        methods: ["Visual inspection", "Pheromone traps", "Light traps", "Egg mass counts"],
        thresholds: "Treatment at 10% defoliation or 2+ larvae per plant",
      },
    },
    Beetle: {
      pestName: "Beetle",
      prevention: {
        cultural: [
          "Use crop rotation to break pest cycles",
          "Plant trap crops to concentrate beetles",
          "Maintain field sanitation",
          "Use resistant varieties when available",
          "Adjust planting dates to avoid peak emergence",
          "Deep cultivation to destroy overwintering adults",
        ],
        biological: [
          "Encourage natural predators (ground beetles, spiders)",
          "Use entomopathogenic nematodes for soil-dwelling stages",
          "Apply beneficial fungi (Beauveria bassiana)",
          "Maintain habitat for beneficial insects",
          "Use parasitic wasps for specific beetle species",
        ],
        mechanical: [
          "Hand-picking of adults",
          "Use of row covers during vulnerable stages",
          "Sticky traps for monitoring",
          "Barrier methods around plants",
          "Vacuum collection of adults",
        ],
      },
      treatment: {
        organic: [
          {
            name: "Pyrethrin",
            dosage: "Follow label instructions (1-2ml/L)",
            application: "Foliar spray targeting adults",
            frequency: "As needed, maximum 3 applications",
            timing: "Early morning when beetles are less active",
          },
          {
            name: "Beauveria bassiana",
            dosage: "1-2 teaspoons per gallon (2.5-5ml/L)",
            application: "Foliar spray or soil application",
            frequency: "Every 7-14 days",
            timing: "High humidity conditions preferred",
          },
          {
            name: "Diatomaceous Earth",
            dosage: "Light dusting on plants and soil",
            application: "Dry application to affected areas",
            frequency: "Reapply after rain",
            timing: "When beetles are present",
          },
        ],
        chemical: [
          {
            name: "Carbaryl",
            activeIngredient: "Carbaryl 85%",
            dosage: "1.0-2.0g per liter",
            application: "Foliar spray or soil treatment",
            frequency: "Maximum 2 applications per season",
            preharvest: "14 days",
            safety: "Broad spectrum, harmful to beneficial insects",
          },
          {
            name: "Thiamethoxam",
            activeIngredient: "Thiamethoxam 25%",
            dosage: "0.2-0.4g per liter",
            application: "Foliar spray or seed treatment",
            frequency: "1-2 applications per season",
            preharvest: "21 days",
            safety: "Systemic action, long residual activity",
          },
        ],
      },
      monitoring: {
        frequency: "Weekly during active season",
        methods: ["Visual inspection", "Sticky traps", "Sweep net sampling", "Soil sampling"],
        thresholds: "Treatment at 10% defoliation or 5+ beetles per plant",
      },
    },
    Mealybug: {
      pestName: "Mealybug",
      prevention: {
        cultural: [
          "Quarantine new plants before introduction",
          "Maintain proper plant spacing",
          "Avoid over-fertilization with nitrogen",
          "Regular cleaning of plant surfaces",
          "Remove plant debris and weeds",
          "Maintain proper humidity levels",
        ],
        biological: [
          "Encourage natural predators (ladybugs, lacewings)",
          "Use parasitic wasps (Anagyrus pseudococci)",
          "Apply predatory beetles (Cryptolaemus montrouzieri)",
          "Maintain ant control (ants protect mealybugs)",
          "Use entomopathogenic fungi",
        ],
        mechanical: [
          "Manual removal with alcohol swabs",
          "High-pressure water sprays",
          "Pruning of heavily infested parts",
          "Sticky traps for crawlers",
          "Regular inspection of hidden areas",
        ],
      },
      treatment: {
        organic: [
          {
            name: "Insecticidal Soap",
            dosage: "2-3 tablespoons per gallon (15-22ml/L)",
            application: "Direct spray on mealybug colonies",
            frequency: "Every 5-7 days",
            timing: "Target crawler stage for best results",
          },
          {
            name: "Neem Oil",
            dosage: "2-4 tablespoons per gallon (15-30ml/L)",
            application: "Systemic and contact action",
            frequency: "Every 7-14 days",
            timing: "Evening application preferred",
          },
          {
            name: "Horticultural Oil",
            dosage: "2-3 tablespoons per gallon (15-22ml/L)",
            application: "Thorough coverage of all plant parts",
            frequency: "Every 7-10 days",
            timing: "Cool parts of the day",
          },
        ],
        chemical: [
          {
            name: "Spirotetramat",
            activeIngredient: "Spirotetramat 22.4%",
            dosage: "0.75-1.5ml per liter",
            application: "Systemic soil drench or foliar spray",
            frequency: "1-2 applications per season",
            preharvest: "7 days",
            safety: "Effective against all life stages",
          },
          {
            name: "Buprofezin",
            activeIngredient: "Buprofezin 25%",
            dosage: "1.0-2.0ml per liter",
            application: "Foliar spray targeting nymphs",
            frequency: "Maximum 2 applications per season",
            preharvest: "14 days",
            safety: "Growth regulator, low mammalian toxicity",
          },
        ],
      },
      monitoring: {
        frequency: "Weekly inspection",
        methods: ["Visual inspection of stems and leaves", "Sticky traps", "Ant activity monitoring"],
        thresholds: "Treatment when colonies are detected or 5% plant coverage",
      },
    },
    Leafhopper: {
      pestName: "Leafhopper",
      prevention: {
        cultural: [
          "Use resistant varieties when available",
          "Remove weeds that serve as alternate hosts",
          "Maintain proper plant nutrition",
          "Use reflective mulches",
          "Avoid over-fertilization with nitrogen",
          "Practice crop rotation",
        ],
        biological: [
          "Encourage natural predators (spiders, minute pirate bugs)",
          "Use parasitic wasps and egg parasitoids",
          "Apply entomopathogenic fungi",
          "Maintain diverse habitat for beneficial insects",
          "Use predatory mites in some systems",
        ],
        mechanical: [
          "Use yellow sticky traps for monitoring",
          "Row covers during vulnerable stages",
          "Vacuum collection of adults",
          "Remove alternate host plants",
          "Regular inspection and monitoring",
        ],
      },
      treatment: {
        organic: [
          {
            name: "Insecticidal Soap",
            dosage: "2-3 tablespoons per gallon (15-22ml/L)",
            application: "Foliar spray targeting nymphs",
            frequency: "Every 5-7 days",
            timing: "When nymphs are present",
          },
          {
            name: "Pyrethrin",
            dosage: "Follow label instructions (1-2ml/L)",
            application: "Foliar spray for quick knockdown",
            frequency: "As needed, maximum 3 applications",
            timing: "Early morning or evening",
          },
          {
            name: "Neem Oil",
            dosage: "2-3 tablespoons per gallon (15-22ml/L)",
            application: "Systemic and contact action",
            frequency: "Every 7-14 days",
            timing: "Regular preventive applications",
          },
        ],
        chemical: [
          {
            name: "Imidacloprid",
            activeIngredient: "Imidacloprid 17.8%",
            dosage: "0.5-1.0ml per liter",
            application: "Systemic soil drench or foliar spray",
            frequency: "Once per season",
            preharvest: "21 days",
            safety: "Long residual activity, avoid during bloom",
          },
          {
            name: "Deltamethrin",
            activeIngredient: "Deltamethrin 2.8%",
            dosage: "0.5-1.0ml per liter",
            application: "Foliar spray for adult control",
            frequency: "Maximum 2 applications per season",
            preharvest: "7 days",
            safety: "Fast knockdown, harmful to beneficial insects",
          },
        ],
      },
      monitoring: {
        frequency: "Weekly during growing season",
        methods: ["Visual inspection", "Yellow sticky traps", "Sweep net sampling"],
        thresholds: "Treatment at 10+ leafhoppers per plant or visible damage",
      },
    },
  }

  // Fallback treatment protocol for pests not specifically covered
  const getGenericTreatmentProtocol = (pestName: string): TreatmentProtocol => ({
    pestName,
    prevention: {
      cultural: [
        "Maintain healthy plants through proper nutrition and watering",
        "Use resistant varieties when available",
        "Practice crop rotation to break pest cycles",
        "Remove plant debris and weeds regularly",
        "Maintain proper plant spacing for air circulation",
        "Monitor plants regularly for early detection",
      ],
      biological: [
        "Encourage beneficial insects and natural predators",
        "Maintain diverse habitat around crops",
        "Avoid broad-spectrum pesticides that harm beneficials",
        "Use companion planting to support beneficial insects",
        "Apply beneficial microorganisms when appropriate",
      ],
      mechanical: [
        "Regular inspection and monitoring",
        "Manual removal when feasible",
        "Use appropriate traps for monitoring",
        "Physical barriers when applicable",
        "Proper sanitation practices",
      ],
    },
    treatment: {
      organic: [
        {
          name: "Neem Oil",
          dosage: "2-3 tablespoons per gallon (15-22ml/L)",
          application: "Foliar spray with thorough coverage",
          frequency: "Every 7-14 days as needed",
          timing: "Early morning or evening application",
        },
        {
          name: "Insecticidal Soap",
          dosage: "2-3 tablespoons per gallon (15-22ml/L)",
          application: "Direct spray on pest colonies",
          frequency: "Every 5-7 days as needed",
          timing: "When pests are present and active",
        },
        {
          name: "Horticultural Oil",
          dosage: "1-2 tablespoons per gallon (7.5-15ml/L)",
          application: "Thorough plant coverage",
          frequency: "Every 7-10 days",
          timing: "Cool parts of the day to avoid phytotoxicity",
        },
      ],
      chemical: [
        {
          name: "Broad Spectrum Insecticide",
          activeIngredient: "Contact local extension service",
          dosage: "Follow label instructions",
          application: "As directed on product label",
          frequency: "As recommended by manufacturer",
          preharvest: "Check product label",
          safety: "Always wear protective equipment and follow all safety guidelines",
        },
      ],
    },
    monitoring: {
      frequency: "Weekly during growing season",
      methods: ["Visual inspection", "Appropriate traps", "Regular plant health assessment"],
      thresholds: "Treatment when pest damage becomes economically significant",
    },
  })

  const currentProtocol = selectedPest
    ? treatmentProtocols[selectedPest] || getGenericTreatmentProtocol(selectedPest)
    : null

  useEffect(() => {
    const storedData = sessionStorage.getItem("treatmentData")
    if (storedData) {
      const data = JSON.parse(storedData)
      setTreatmentData(data)
      if (data.detectedPests.length > 0) {
        setSelectedPest(data.detectedPests[0].class)
      }
    } else {
      router.push("/")
    }
  }, [router])

  if (!treatmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading treatment recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" onClick={() => router.push("/results")} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Results
            </Button>
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold">Treatment & Prevention Guide</span>
            </div>
            <Badge variant="secondary">{treatmentData.imageType} Analysis</Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Pest Management Protocols</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive treatment and prevention strategies for detected pests based on integrated pest management
            (IPM) principles
          </p>
        </div>

        {/* Detected Pests Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Detected Pests Summary
            </CardTitle>
            <CardDescription>
              Analysis completed on {new Date(treatmentData.analysisDate).toLocaleString()} • {treatmentData.imageType}{" "}
              Image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {treatmentData.detectedPests.map((pest, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedPest === pest.class ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedPest(pest.class)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{pest.class}</h3>
                      <Badge variant={pest.confidence > 0.8 ? "destructive" : "default"}>
                        {Math.round(pest.confidence * 100)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedPest === pest.class ? "Currently viewing" : "Click to view treatment"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Treatment Protocol */}
        {currentProtocol && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="w-6 h-6 text-green-600" />
                  {currentProtocol.pestName} Management Protocol
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="prevention" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="prevention">Prevention</TabsTrigger>
                    <TabsTrigger value="organic">Organic Treatment</TabsTrigger>
                    <TabsTrigger value="chemical">Chemical Treatment</TabsTrigger>
                    <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                  </TabsList>

                  <TabsContent value="prevention" className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-green-600" />
                            Cultural Control
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {currentProtocol.prevention.cultural.map((method, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                {method}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            Biological Control
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {currentProtocol.prevention.biological.map((method, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                {method}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-600" />
                            Mechanical Control
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {currentProtocol.prevention.mechanical.map((method, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                                {method}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="organic" className="space-y-6">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Organic treatments are safer for beneficial insects and the environment. Always read and follow
                        label instructions.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      {currentProtocol.treatment.organic.map((treatment, index) => (
                        <Card key={index} className="border-l-4 border-l-green-500">
                          <CardContent className="pt-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-semibold mb-3">{treatment.name}</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Droplets className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">Dosage:</span>
                                    <span>{treatment.dosage}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-500" />
                                    <span className="font-medium">Application:</span>
                                    <span>{treatment.application}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-orange-500" />
                                  <span className="font-medium">Frequency:</span>
                                  <span>{treatment.frequency}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Info className="w-4 h-4 text-purple-500 mt-0.5" />
                                  <div>
                                    <span className="font-medium">Timing:</span>
                                    <p className="text-gray-600">{treatment.timing}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="chemical" className="space-y-6">
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Chemical treatments should be used as a last resort. Always follow label instructions, wear
                        protective equipment, and observe pre-harvest intervals.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      {currentProtocol.treatment.chemical.map((treatment, index) => (
                        <Card key={index} className="border-l-4 border-l-red-500">
                          <CardContent className="pt-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-lg font-semibold mb-2">{treatment.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                  Active Ingredient: {treatment.activeIngredient}
                                </p>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Beaker className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium">Dosage:</span>
                                    <span>{treatment.dosage}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-500" />
                                    <span className="font-medium">Application:</span>
                                    <span>{treatment.application}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-orange-500" />
                                  <span className="font-medium">Frequency:</span>
                                  <span>{treatment.frequency}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                  <span className="font-medium">Pre-harvest:</span>
                                  <span>{treatment.preharvest}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Shield className="w-4 h-4 text-purple-500 mt-0.5" />
                                  <div>
                                    <span className="font-medium">Safety:</span>
                                    <p className="text-gray-600">{treatment.safety}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="monitoring" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Monitoring Schedule
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2">Frequency</h4>
                            <p className="text-sm text-gray-600">{currentProtocol.monitoring.frequency}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Methods</h4>
                            <ul className="space-y-1">
                              {currentProtocol.monitoring.methods.map((method, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                  {method}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Treatment Thresholds</h4>
                            <p className="text-sm text-gray-600">{currentProtocol.monitoring.thresholds}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}

        {/* General IPM Principles */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Integrated Pest Management (IPM) Principles</CardTitle>
            <CardDescription>Follow these core principles for sustainable pest management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Prevention First</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use resistant varieties when available</li>
                  <li>• Maintain healthy soil and proper nutrition</li>
                  <li>• Practice crop rotation and diversification</li>
                  <li>• Implement proper sanitation practices</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Treatment Hierarchy</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. Cultural and mechanical controls</li>
                  <li>2. Biological controls and beneficial insects</li>
                  <li>3. Organic and low-impact treatments</li>
                  <li>4. Chemical controls as last resort</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Warning */}
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Always consult with local agricultural extension services or certified pest
            management professionals before implementing treatment programs. Follow all label instructions and local
            regulations for pesticide use.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
