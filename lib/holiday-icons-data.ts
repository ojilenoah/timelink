import { TreePine, Egg, Sparkles, Sparkle, Landmark } from "lucide-react"
import { Snowflake, Leaf, Flower2, Sun, Ghost, PiIcon as Pumpkin, Skull } from "lucide-react"
import { Umbrella, Palmtree, Plane, Ship, Car, Tent, Mountain, Backpack, Footprints } from "lucide-react"
import {
  Cake,
  Gift,
  PartyPopper,
  SparkleIcon as Firework,
  Heart,
  GraduationCapIcon as Graduation,
  BellRingIcon as Ring,
  Baby,
  HeartHandshake,
} from "lucide-react"
import { Drumstick, Utensils, Wine, Flame, Sandwich } from "lucide-react"
import { Music, Flag, Briefcase, Scroll, Flower, Hammer, Star, Sprout } from "lucide-react"

export type HolidayIconType = {
  icon: any
  name: string
  category: string
}

// Define icon categories
const categories = {
  religious: "Religious Holidays",
  seasonal: "Seasonal Holidays",
  vacation: "Vacation & Travel",
  celebration: "Celebrations",
  food: "Food & Drink",
  misc: "Miscellaneous",
}

// Define holiday icons with their categories
export const holidayIcons: HolidayIconType[] = [
  // Religious holidays
  { name: "Christmas Tree", icon: TreePine, category: "religious" },
  { name: "Easter Egg", icon: Egg, category: "religious" },
  { name: "Menorah", icon: Sparkles, category: "religious" },
  { name: "Prayer", icon: Sparkle, category: "religious" },
  { name: "Church", icon: Landmark, category: "religious" },

  // Seasonal holidays
  { name: "Snowflake", icon: Snowflake, category: "seasonal" },
  { name: "Autumn Leaf", icon: Leaf, category: "seasonal" },
  { name: "Spring Flower", icon: Flower2, category: "seasonal" },
  { name: "Summer Sun", icon: Sun, category: "seasonal" },
  { name: "Halloween", icon: Ghost, category: "seasonal" },
  { name: "Pumpkin", icon: Pumpkin, category: "seasonal" },
  { name: "Skull", icon: Skull, category: "seasonal" },

  // Vacation & Travel
  { name: "Beach Umbrella", icon: Umbrella, category: "vacation" },
  { name: "Palm Tree", icon: Palmtree, category: "vacation" },
  { name: "Airplane", icon: Plane, category: "vacation" },
  { name: "Cruise Ship", icon: Ship, category: "vacation" },
  { name: "Road Trip", icon: Car, category: "vacation" },
  { name: "Camping", icon: Tent, category: "vacation" },
  { name: "Hiking", icon: Mountain, category: "vacation" },
  { name: "Backpacking", icon: Backpack, category: "vacation" },
  { name: "Beach Vacation", icon: Footprints, category: "vacation" },

  // Celebrations
  { name: "Birthday Cake", icon: Cake, category: "celebration" },
  { name: "Gift", icon: Gift, category: "celebration" },
  { name: "Party Popper", icon: PartyPopper, category: "celebration" },
  { name: "Firework", icon: Firework, category: "celebration" },
  { name: "Anniversary", icon: Heart, category: "celebration" },
  { name: "Graduation", icon: Graduation, category: "celebration" },
  { name: "Wedding", icon: Ring, category: "celebration" },
  { name: "Baby Shower", icon: Baby, category: "celebration" },
  { name: "Engagement", icon: HeartHandshake, category: "celebration" },

  // Food & Drink
  { name: "Thanksgiving", icon: Drumstick, category: "food" },
  { name: "Dinner Party", icon: Utensils, category: "food" },
  { name: "Wine Tasting", icon: Wine, category: "food" },
  { name: "BBQ", icon: Flame, category: "food" },
  { name: "Picnic", icon: Sandwich, category: "food" },

  // Miscellaneous
  { name: "Music Festival", icon: Music, category: "misc" },
  { name: "National Holiday", icon: Flag, category: "misc" },
  { name: "Work Holiday", icon: Briefcase, category: "misc" },
  { name: "School Break", icon: Scroll, category: "misc" },
  { name: "Memorial Day", icon: Flower, category: "misc" },
  { name: "Independence Day", icon: Flag, category: "misc" },
  { name: "Labor Day", icon: Hammer, category: "misc" },
  { name: "Veterans Day", icon: Star, category: "misc" },
  { name: "Earth Day", icon: Sprout, category: "misc" },
  { name: "New Year", icon: Sparkles, category: "celebration" },
]

// Helper functions for icon selection
export function getAllCategories() {
  return Object.keys(categories)
}

export function getCategoryLabel(category: string) {
  return categories[category as keyof typeof categories] || category
}

export function getIconsByCategory(category: string) {
  return holidayIcons.filter((icon) => icon.category === category)
}

export function searchIcons(query: string) {
  const lowerQuery = query.toLowerCase()
  return holidayIcons.filter(
    (icon) => icon.name.toLowerCase().includes(lowerQuery) || icon.category.toLowerCase().includes(lowerQuery),
  )
}
