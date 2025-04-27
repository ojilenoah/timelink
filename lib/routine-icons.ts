import {
  Activity,
  AlarmClock,
  Apple,
  Baby,
  Bath,
  Bed,
  Beer,
  Bike,
  Book,
  BookOpen,
  Briefcase,
  Brush,
  Calculator,
  Calendar,
  Camera,
  Car,
  CheckSquare,
  ChefHat,
  Cigarette,
  ClipboardList,
  Clock,
  Cloud,
  Code,
  Coffee,
  Compass,
  CreditCard,
  Database,
  Dog,
  DollarSign,
  Dumbbell,
  Egg,
  FileText,
  Film,
  FlaskConical,
  Flower,
  Gamepad2,
  Gift,
  GlassWater,
  Globe,
  Hammer,
  HandIcon as HandWashing,
  Headphones,
  Heart,
  Home,
  Hotel,
  Inbox,
  Instagram,
  Languages,
  Laptop,
  Leaf,
  Library,
  Lightbulb,
  Mail,
  Map,
  MedalIcon as Meditation,
  MessageCircle,
  Mic,
  Microscope,
  Moon,
  Mountain,
  Music,
  Newspaper,
  Palette,
  Pencil,
  Phone,
  PieChart,
  Pill,
  Pizza,
  Plane,
  TreesIcon as Plant,
  PlayCircle,
  Podcast,
  Presentation,
  Printer,
  Puzzle,
  Receipt,
  Recycle,
  Repeat,
  Rocket,
  Scissors,
  Search,
  Send,
  Server,
  ShoppingBag,
  ShoppingCart,
  ShowerHeadIcon as Shower,
  Smartphone,
  Smile,
  Snowflake,
  Sparkles,
  Speaker,
  Star,
  Sun,
  Sunrise,
  Sunset,
  ShowerHeadIcon as SwimmingPool,
  Syringe,
  Target,
  Tent,
  Thermometer,
  Timer,
  BrushIcon as Toothbrush,
  Trash2,
  Trophy,
  Tv,
  Umbrella,
  Users,
  Utensils,
  Video,
  Wallet,
  Watch,
  Wind,
  Wine,
  Wrench,
  SpaceIcon as Yoga,
  Zap,
} from "lucide-react"

export type RoutineIconType = {
  icon: any
  name: string
  category: string
}

export const routineIcons: RoutineIconType[] = [
  // Fitness & Health
  { icon: Activity, name: "Exercise", category: "Fitness & Health" },
  { icon: Dumbbell, name: "Strength Training", category: "Fitness & Health" },
  { icon: Bike, name: "Cycling", category: "Fitness & Health" },
  { icon: Yoga, name: "Yoga", category: "Fitness & Health" },
  { icon: SwimmingPool, name: "Swimming", category: "Fitness & Health" },
  { icon: Heart, name: "Cardio", category: "Fitness & Health" },
  { icon: Apple, name: "Healthy Eating", category: "Fitness & Health" },
  { icon: GlassWater, name: "Hydration", category: "Fitness & Health" },
  { icon: Pill, name: "Medication", category: "Fitness & Health" },
  { icon: Syringe, name: "Vitamins", category: "Fitness & Health" },
  { icon: Thermometer, name: "Temperature Check", category: "Fitness & Health" },
  { icon: Cigarette, name: "Quit Smoking", category: "Fitness & Health" },

  // Sleep & Rest
  { icon: Moon, name: "Sleep", category: "Sleep & Rest" },
  { icon: Bed, name: "Bedtime", category: "Sleep & Rest" },
  { icon: AlarmClock, name: "Wake Up", category: "Sleep & Rest" },
  { icon: Sunrise, name: "Morning Routine", category: "Sleep & Rest" },
  { icon: Sunset, name: "Evening Routine", category: "Sleep & Rest" },
  { icon: Meditation, name: "Meditation", category: "Sleep & Rest" },
  { icon: Wind, name: "Breathing Exercise", category: "Sleep & Rest" },
  { icon: Cloud, name: "Dream Journal", category: "Sleep & Rest" },

  // Productivity & Work
  { icon: Briefcase, name: "Work", category: "Productivity & Work" },
  { icon: CheckSquare, name: "Task List", category: "Productivity & Work" },
  { icon: ClipboardList, name: "Planning", category: "Productivity & Work" },
  { icon: Clock, name: "Time Blocking", category: "Productivity & Work" },
  { icon: Timer, name: "Pomodoro", category: "Productivity & Work" },
  { icon: Calendar, name: "Schedule", category: "Productivity & Work" },
  { icon: Inbox, name: "Email", category: "Productivity & Work" },
  { icon: FileText, name: "Documentation", category: "Productivity & Work" },
  { icon: Presentation, name: "Presentation", category: "Productivity & Work" },
  { icon: Target, name: "Goal Setting", category: "Productivity & Work" },
  { icon: Repeat, name: "Habit Tracking", category: "Productivity & Work" },

  // Personal Care
  { icon: Bath, name: "Bathing", category: "Personal Care" },
  { icon: Shower, name: "Shower", category: "Personal Care" },
  { icon: HandWashing, name: "Hand Washing", category: "Personal Care" },
  { icon: Toothbrush, name: "Dental Care", category: "Personal Care" },
  { icon: Scissors, name: "Grooming", category: "Personal Care" },
  { icon: Brush, name: "Skincare", category: "Personal Care" },
  { icon: Sparkles, name: "Self-Care", category: "Personal Care" },

  // Hobbies & Leisure
  { icon: Book, name: "Reading", category: "Hobbies & Leisure" },
  { icon: BookOpen, name: "Book Club", category: "Hobbies & Leisure" },
  { icon: Music, name: "Music Practice", category: "Hobbies & Leisure" },
  { icon: Headphones, name: "Listening", category: "Hobbies & Leisure" },
  { icon: Palette, name: "Art", category: "Hobbies & Leisure" },
  { icon: Camera, name: "Photography", category: "Hobbies & Leisure" },
  { icon: Film, name: "Movie Night", category: "Hobbies & Leisure" },
  { icon: Tv, name: "TV Time", category: "Hobbies & Leisure" },
  { icon: Gamepad2, name: "Gaming", category: "Hobbies & Leisure" },
  { icon: Puzzle, name: "Puzzles", category: "Hobbies & Leisure" },
  { icon: Flower, name: "Gardening", category: "Hobbies & Leisure" },
  { icon: Plant, name: "Plant Care", category: "Hobbies & Leisure" },
  { icon: ChefHat, name: "Cooking", category: "Hobbies & Leisure" },
  { icon: Utensils, name: "Meal Prep", category: "Hobbies & Leisure" },
  { icon: Pizza, name: "Baking", category: "Hobbies & Leisure" },
  { icon: Wine, name: "Wine Tasting", category: "Hobbies & Leisure" },

  // Learning & Education
  { icon: Laptop, name: "Online Course", category: "Learning & Education" },
  { icon: Code, name: "Coding", category: "Learning & Education" },
  { icon: Languages, name: "Language Learning", category: "Learning & Education" },
  { icon: Library, name: "Study", category: "Learning & Education" },
  { icon: Pencil, name: "Writing", category: "Learning & Education" },
  { icon: Calculator, name: "Math Practice", category: "Learning & Education" },
  { icon: Microscope, name: "Science", category: "Learning & Education" },
  { icon: FlaskConical, name: "Experiment", category: "Learning & Education" },
  { icon: Lightbulb, name: "Brainstorming", category: "Learning & Education" },
  { icon: Newspaper, name: "News Reading", category: "Learning & Education" },
  { icon: Podcast, name: "Podcast", category: "Learning & Education" },

  // Home & Family
  { icon: Home, name: "Home Maintenance", category: "Home & Family" },
  { icon: Wrench, name: "DIY Project", category: "Home & Family" },
  { icon: Hammer, name: "Home Repair", category: "Home & Family" },
  { icon: Trash2, name: "Cleaning", category: "Home & Family" },
  { icon: Recycle, name: "Recycling", category: "Home & Family" },
  { icon: ShoppingCart, name: "Grocery Shopping", category: "Home & Family" },
  { icon: Baby, name: "Childcare", category: "Home & Family" },
  { icon: Dog, name: "Pet Care", category: "Home & Family" },
  { icon: Users, name: "Family Time", category: "Home & Family" },

  // Social & Communication
  { icon: MessageCircle, name: "Check-in Call", category: "Social & Communication" },
  { icon: Phone, name: "Phone Call", category: "Social & Communication" },
  { icon: Mail, name: "Letter Writing", category: "Social & Communication" },
  { icon: Send, name: "Messaging", category: "Social & Communication" },
  { icon: Instagram, name: "Social Media", category: "Social & Communication" },
  { icon: Video, name: "Video Chat", category: "Social & Communication" },
  { icon: Mic, name: "Voice Memo", category: "Social & Communication" },
  { icon: Gift, name: "Gift Giving", category: "Social & Communication" },

  // Finance & Money
  { icon: DollarSign, name: "Budgeting", category: "Finance & Money" },
  { icon: CreditCard, name: "Expense Tracking", category: "Finance & Money" },
  { icon: PieChart, name: "Financial Review", category: "Finance & Money" },
  { icon: Receipt, name: "Receipt Organization", category: "Finance & Money" },
  { icon: Wallet, name: "Saving", category: "Finance & Money" },
  { icon: ShoppingBag, name: "No-Spend Day", category: "Finance & Money" },

  // Travel & Exploration
  { icon: Plane, name: "Travel Planning", category: "Travel & Exploration" },
  { icon: Map, name: "Navigation", category: "Travel & Exploration" },
  { icon: Compass, name: "Exploration", category: "Travel & Exploration" },
  { icon: Globe, name: "World Tour", category: "Travel & Exploration" },
  { icon: Mountain, name: "Hiking", category: "Travel & Exploration" },
  { icon: Car, name: "Road Trip", category: "Travel & Exploration" },
  { icon: Tent, name: "Camping", category: "Travel & Exploration" },
  { icon: Hotel, name: "Accommodation", category: "Travel & Exploration" },

  // Technology
  { icon: Smartphone, name: "Digital Detox", category: "Technology" },
  { icon: Database, name: "Data Backup", category: "Technology" },
  { icon: Server, name: "System Update", category: "Technology" },
  { icon: Printer, name: "Printing", category: "Technology" },
  { icon: Search, name: "Research", category: "Technology" },

  // Miscellaneous
  { icon: Coffee, name: "Coffee Break", category: "Miscellaneous" },
  { icon: Beer, name: "Happy Hour", category: "Miscellaneous" },
  { icon: Sun, name: "Sunshine", category: "Miscellaneous" },
  { icon: Umbrella, name: "Rainy Day", category: "Miscellaneous" },
  { icon: Snowflake, name: "Winter Activity", category: "Miscellaneous" },
  { icon: Leaf, name: "Fall Activity", category: "Miscellaneous" },
  { icon: Smile, name: "Gratitude", category: "Miscellaneous" },
  { icon: Trophy, name: "Celebration", category: "Miscellaneous" },
  { icon: Rocket, name: "New Project", category: "Miscellaneous" },
  { icon: Zap, name: "Energy Boost", category: "Miscellaneous" },
  { icon: Star, name: "Favorites", category: "Miscellaneous" },
  { icon: Watch, name: "Time Management", category: "Miscellaneous" },
  { icon: PlayCircle, name: "Entertainment", category: "Miscellaneous" },
  { icon: Speaker, name: "Audio", category: "Miscellaneous" },
  { icon: Egg, name: "Breakfast", category: "Miscellaneous" },
]

// Helper function to get icon by name
export function getIconByName(name: string) {
  return routineIcons.find((icon) => icon.name === name)?.icon || Coffee
}

// Helper function to get all categories
export function getAllCategories() {
  return [...new Set(routineIcons.map((icon) => icon.category))]
}

// Helper function to get icons by category
export function getIconsByCategory(category: string) {
  return routineIcons.filter((icon) => icon.category === category)
}

// Helper function to search icons by name
export function searchIcons(query: string) {
  if (!query) return routineIcons

  const lowerQuery = query.toLowerCase()
  return routineIcons.filter(
    (icon) => icon.name.toLowerCase().includes(lowerQuery) || icon.category.toLowerCase().includes(lowerQuery),
  )
}
