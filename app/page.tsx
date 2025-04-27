"use client"

import type React from "react"
import { useState } from "react"
import { MobileLayout } from "@/components/mobile-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Repeat, Shirt, ArrowRight, Sun, Cloud, CloudRain, CloudSnow, Wind, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAppState } from "@/contexts/app-state-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Home() {
  // Get current date and user name from settings
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  // Get user settings and state functions
  const { userSettings, setUserSettings, wardrobeItems } = useAppState()
  const userName = userSettings.profile.name

  // Weather condition state
  const [weatherCondition, setWeatherCondition] = useState<"sunny" | "cloudy" | "rainy" | "snowy" | "windy">(
    userSettings.weatherCondition,
  )

  // Mock data for dashboard
  const upcomingEvents = [
    { time: "10:00", title: "Team Meeting", type: "Work" },
    { time: "13:30", title: "Lunch with Sarah", type: "Personal" },
    { time: "17:00", title: "Gym Session", type: "Health" },
  ]

  const streaks = [
    { name: "Morning Routine", days: 0 },
    { name: "Reading", days: 0 },
  ]

  // Weather condition icons
  const weatherIcons = {
    sunny: <Sun size={24} className="text-yellow-400" />,
    cloudy: <Cloud size={24} className="text-gray-400" />,
    rainy: <CloudRain size={24} className="text-blue-400" />,
    snowy: <CloudSnow size={24} className="text-blue-200" />,
    windy: <Wind size={24} className="text-gray-400" />,
  }

  // Weather condition labels
  const weatherLabels = {
    sunny: "Sunny",
    cloudy: "Cloudy",
    rainy: "Rainy",
    snowy: "Snowy",
    windy: "Windy",
  }

  // Outfit recommendations based on weather
  const outfitRecommendations = {
    sunny: ["Light t-shirt and shorts", "Sundress with sandals", "Light cotton shirt with jeans", "Hat and sunglasses"],
    cloudy: [
      "Light jacket with jeans",
      "Long-sleeve shirt with pants",
      "Sweater with comfortable pants",
      "Casual outfit with a light scarf",
    ],
    rainy: [
      "Raincoat with waterproof shoes",
      "Umbrella with water-resistant pants",
      "Waterproof jacket with boots",
      "Rain boots with a hooded jacket",
    ],
    snowy: [
      "Heavy winter coat with boots",
      "Thermal layers with snow pants",
      "Insulated jacket with gloves and hat",
      "Warm sweater with thermal pants and snow boots",
    ],
    windy: [
      "Windbreaker with secure hat",
      "Layered clothing with a jacket",
      "Secure scarf with a buttoned coat",
      "Fitted cap with a wind-resistant jacket",
    ],
  }

  // Handle weather condition change
  const handleWeatherChange = (value: "sunny" | "cloudy" | "rainy" | "snowy" | "windy") => {
    setWeatherCondition(value)
    setUserSettings({
      ...userSettings,
      weatherCondition: value,
    })
  }

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-muted-foreground">{formattedDate}</p>
          <h1 className="text-2xl font-semibold">Welcome back, {userName} 👋</h1>
        </div>

        {/* Summary Panel */}
        <Card className="gradient-card p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium">Today's Summary</h2>
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Calendar Events */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <Calendar size={14} className="mr-1" /> Upcoming Events
              </h3>
              <div className="space-y-2">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">{event.time}</span>
                      <p className="text-sm">{event.title}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{event.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Streaks */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <Repeat size={14} className="mr-1" /> Streaks
              </h3>
              <div className="space-y-2">
                {streaks.map((streak, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <p className="text-sm">{streak.name}</p>
                    <span className="text-xs font-medium">
                      {streak.days} days {streak.days > 0 ? "🔥" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Weather & Outfit - Now clickable */}
        <Link href="/wardrobe">
          <Card className="gradient-card-secondary p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Weather & Outfit</h2>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>

            <div className="space-y-4">
              {/* Weather Condition Selector */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">{weatherIcons[weatherCondition]}</div>
                <div className="flex-grow">
                  <Select
                    value={weatherCondition}
                    onValueChange={(value: "sunny" | "cloudy" | "rainy" | "snowy" | "windy") =>
                      handleWeatherChange(value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select weather condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunny">Sunny</SelectItem>
                      <SelectItem value="cloudy">Cloudy</SelectItem>
                      <SelectItem value="rainy">Rainy</SelectItem>
                      <SelectItem value="snowy">Snowy</SelectItem>
                      <SelectItem value="windy">Windy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Outfit Recommendations */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <Shirt size={14} className="mr-1" /> Recommended Outfits for {weatherLabels[weatherCondition]} Weather
                </h3>
                <ul className="space-y-2">
                  {outfitRecommendations[weatherCondition].map((outfit, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="mr-2">•</span>
                      <span>{outfit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </Link>

        {/* Navigation Cards section removed */}
      </div>
    </MobileLayout>
  )
}

function NavigationCard({
  icon: Icon,
  title,
  href,
}: {
  icon: React.ElementType
  title: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="gradient-card h-24 rounded-xl flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
        <Icon size={24} className="mb-2 text-primary" />
        <h3 className="text-sm font-medium">{title}</h3>
      </Card>
    </Link>
  )
}
