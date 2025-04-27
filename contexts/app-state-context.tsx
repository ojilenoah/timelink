"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define types for our state
type Location = {
  lat: number
  lng: number
  address: string
} | null

// Update the Event type to include recurring information and auto-deletion settings
type Event = {
  id: number
  title: string
  date: Date
  startTime: string
  endTime: string
  location: string
  description: string
  category: string
  mapLocation?: Location
  // New fields for recurring events and auto-deletion
  isRecurring: boolean
  recurrencePattern?: "daily" | "weekly" | "monthly" | "yearly"
  recurrenceInterval?: number // e.g., every 2 weeks
  recurrenceDay?: number[] // days of week for weekly (0-6, Sunday-Saturday)
  recurrenceEndDate?: Date | null // null means no end date
  skipAutoDelete: boolean // if true, event won't be auto-deleted
  lastOccurrence?: Date // for tracking the last occurrence of a recurring event
}

// Update Holiday type to use icon instead of color
type Holiday = {
  id: number
  name: string
  startDate: Date
  endDate: Date
  icon: string // Icon name from holiday-icons.ts
  description?: string
}

// Updated Task type to include completedDate
type Task = {
  id: number
  title: string
  completed: boolean
  completedDate?: Date // When the task was last completed
  locked?: boolean // Whether the task is locked (can't be unticked)
}

type Routine = {
  id: number
  title: string
  icon: string
  streak: number
  frequency: string
  goal: string
  goalPeriod: number
  goalUnit: "days" | "weeks" | "months"
  description: string
  tasks: Task[]
  progress: number
  lastResetDate?: Date // Track when tasks were last reset
  lastStreakUpdate?: Date // Track when streak was last updated
}

type WardrobeColor = {
  name: string
  hex: string
}

type WardrobeItem = {
  id: number
  name: string
  brand: string
  tags: string[]
  colors: WardrobeColor[]
  status: "clean" | "worn"
  imageUrl: string
}

type WardrobeCategory = {
  id: string
  label: string
}

type WardrobeItems = {
  [key: string]: WardrobeItem[]
}

type Outfit = {
  id: number
  name: string
  items: number[] // Array of item IDs
  occasion: string
  weather: string
  rating: number // -1 for disliked, 0 for neutral, 1 for liked
  userCreated: boolean
}

// Update the UserSettings type to replace location with weatherCondition
type UserSettings = {
  profile: {
    name: string
    email: string
    avatar: string | null
  }
  notifications: {
    routineReminders: boolean
    calendarAlerts: boolean
    emailNotifications: boolean
    emailAddress: string
  }
  appearance: {
    darkMode: boolean
    theme: string
    fontSize: "small" | "medium" | "large"
  }
  weatherCondition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy"
  calendar?: {
    view: "day" | "week" | "month" | "year"
  }
}

// Define the context type
type AppStateContextType = {
  // Calendar state
  events: Event[]
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>

  // Holidays state
  holidays: Holiday[]
  setHolidays: React.Dispatch<React.SetStateAction<Holiday[]>>

  // Routines state
  routines: Routine[]
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>
  checkAndResetRoutines: () => void // Function to check and reset routines

  // Wardrobe state
  wardrobeCategories: WardrobeCategory[]
  setWardrobeCategories: React.Dispatch<React.SetStateAction<WardrobeCategory[]>>
  wardrobeItems: WardrobeItems
  setWardrobeItems: React.Dispatch<React.SetStateAction<WardrobeItems>>
  outfits: Outfit[]
  setOutfits: React.Dispatch<React.SetStateAction<Outfit[]>>

  // Settings
  userSettings: UserSettings
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>

  // Available colors for wardrobe items
  availableColors: WardrobeColor[]

  // Available icons for routines
  availableIcons: string[]
}

// Create the context
const AppStateContext = createContext<AppStateContextType | undefined>(undefined)

// Create a provider component
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  // Available colors for wardrobe items
  const availableColors: WardrobeColor[] = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Gray", hex: "#808080" },
    { name: "Navy", hex: "#000080" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Light Blue", hex: "#ADD8E6" },
    { name: "Red", hex: "#FF0000" },
    { name: "Burgundy", hex: "#800020" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Purple", hex: "#800080" },
    { name: "Green", hex: "#008000" },
    { name: "Olive", hex: "#808000" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Orange", hex: "#FFA500" },
    { name: "Brown", hex: "#A52A2A" },
    { name: "Beige", hex: "#F5F5DC" },
    { name: "Khaki", hex: "#C3B091" },
    { name: "Teal", hex: "#008080" },
  ]

  // Available icons for routines
  const availableIcons: string[] = [
    "Coffee",
    "BookOpen",
    "Dumbbell",
    "Moon",
    "Sun",
    "Heart",
    "Bike",
    "Utensils",
    "Brain",
    "Briefcase",
    "Code",
    "Music",
    "Palette",
    "Pencil",
    "Phone",
    "Camera",
    "Car",
    "Plane",
    "Train",
    "Ship",
    "Home",
    "Building",
    "Tree",
    "Umbrella",
    "Cloud",
    "Droplet",
    "Wind",
    "Snowflake",
    "Thermometer",
    "Zap",
    "Activity",
    "AlertCircle",
    "Award",
    "Battery",
    "Bell",
    "Calendar",
    "Clock",
    "Compass",
    "Database",
    "Download",
    "Eye",
    "Film",
    "Flag",
    "Folder",
    "Gift",
    "Globe",
    "Headphones",
    "Key",
    "Layers",
    "Map",
    "Monitor",
    "Package",
    "Paperclip",
    "Printer",
  ]

  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Team Meeting",
      date: new Date(2025, 3, 11), // April 11, 2025
      startTime: "10:00",
      endTime: "11:00",
      location: "Conference Room A",
      description: "Weekly sync with product team",
      category: "Work",
      isRecurring: false,
      skipAutoDelete: false,
    },
    {
      id: 2,
      title: "Lunch with Sarah",
      date: new Date(2025, 3, 11), // April 11, 2025
      startTime: "13:30",
      endTime: "14:30",
      location: "Cafe Milano",
      description: "Catch up over lunch",
      category: "Personal",
      isRecurring: false,
      skipAutoDelete: false,
    },
    {
      id: 3,
      title: "Gym Session",
      date: new Date(2025, 3, 11), // April 11, 2025
      startTime: "17:00",
      endTime: "18:00",
      location: "Fitness Center",
      description: "Cardio + upper body",
      category: "Health",
      isRecurring: false,
      skipAutoDelete: false,
    },
    {
      id: 4,
      title: "Doctor Appointment",
      date: new Date(2025, 3, 15), // April 15, 2025
      startTime: "09:00",
      endTime: "10:00",
      location: "Medical Center",
      description: "Annual checkup",
      category: "Health",
      isRecurring: false,
      skipAutoDelete: false,
    },
    {
      id: 5,
      title: "Birthday Party",
      date: new Date(2025, 3, 18), // April 18, 2025
      startTime: "19:00",
      endTime: "22:00",
      location: "John's Place",
      description: "John's 30th birthday celebration",
      category: "Social",
      isRecurring: false,
      skipAutoDelete: false,
    },
  ])

  // Initialize holidays with icons
  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: 1,
      name: "New Year's Day",
      startDate: new Date(2025, 0, 1),
      endDate: new Date(2025, 0, 1),
      icon: "Firework",
      description: "New Year's Day celebration",
    },
    {
      id: 2,
      name: "Spring Break",
      startDate: new Date(2025, 2, 15),
      endDate: new Date(2025, 2, 22),
      icon: "Beach Umbrella",
      description: "Spring break vacation",
    },
    {
      id: 3,
      name: "Memorial Day Weekend",
      startDate: new Date(2025, 4, 24),
      endDate: new Date(2025, 4, 26),
      icon: "Flag",
      description: "Memorial Day long weekend",
    },
    {
      id: 4,
      name: "Christmas",
      startDate: new Date(2025, 11, 25),
      endDate: new Date(2025, 11, 25),
      icon: "Christmas Tree",
      description: "Christmas Day",
    },
    {
      id: 5,
      name: "Summer Vacation",
      startDate: new Date(2025, 6, 15),
      endDate: new Date(2025, 7, 5),
      icon: "Beach Vacation",
      description: "Summer family vacation",
    },
  ])

  // Update the routines to be more tech and content creator focused
  const [routines, setRoutines] = useState<Routine[]>([
    {
      id: 1,
      title: "Morning Productivity",
      icon: "Coffee",
      streak: 0,
      frequency: "daily",
      goal: "Start the day with focus and energy for coding and content creation",
      goalPeriod: 30,
      goalUnit: "days",
      description: "A morning routine to prepare for a productive day of coding and content creation",
      tasks: [
        { id: 1, title: "Hydrate with water", completed: false, locked: false },
        { id: 2, title: "Review task list for the day", completed: false, locked: false },
        { id: 3, title: "Check GitHub notifications", completed: false, locked: false },
        { id: 4, title: "Quick tech news review", completed: false, locked: false },
      ],
      progress: 0,
      lastResetDate: new Date(),
    },
    {
      id: 2,
      title: "Coding Session",
      icon: "Code",
      streak: 0,
      frequency: "daily",
      goal: "Maintain consistent coding practice and project progress",
      goalPeriod: 90,
      goalUnit: "days",
      description: "Focused coding time with minimal distractions",
      tasks: [
        { id: 1, title: "Set up development environment", completed: false, locked: false },
        { id: 2, title: "Code for 90 minutes", completed: false, locked: false },
        { id: 3, title: "Commit changes to GitHub", completed: false, locked: false },
        { id: 4, title: "Document progress", completed: false, locked: false },
      ],
      progress: 0,
      lastResetDate: new Date(),
    },
    {
      id: 3,
      title: "Content Creation",
      icon: "Camera",
      streak: 0,
      frequency: "weekly",
      goal: "Create and schedule tech content consistently",
      goalPeriod: 12,
      goalUnit: "weeks",
      description: "Weekly content creation workflow for tech tutorials and reviews",
      tasks: [
        { id: 1, title: "Brainstorm content ideas", completed: false, locked: false },
        { id: 2, title: "Record video/write article", completed: false, locked: false },
        { id: 3, title: "Edit content", completed: false, locked: false },
        { id: 4, title: "Schedule for publishing", completed: false, locked: false },
      ],
      progress: 0,
      lastResetDate: new Date(),
    },
    {
      id: 4,
      title: "Tech Wellness",
      icon: "Activity",
      streak: 0,
      frequency: "daily",
      goal: "Maintain physical and mental health while working in tech",
      goalPeriod: 30,
      goalUnit: "days",
      description: "Prevent burnout and maintain wellness as a programmer",
      tasks: [
        { id: 1, title: "20/20/20 eye rule (look away every 20 min)", completed: false, locked: false },
        { id: 2, title: "Stretch wrists and shoulders", completed: false, locked: false },
        { id: 3, title: "Stand up and move every hour", completed: false, locked: false },
        { id: 4, title: "Digital detox (30 min before sleep)", completed: false, locked: false },
      ],
      progress: 0,
      lastResetDate: new Date(),
    },
  ])

  const [wardrobeCategories, setWardrobeCategories] = useState<WardrobeCategory[]>([
    { id: "shirts", label: "Shirts" },
    { id: "pants", label: "Pants" },
    { id: "shoes", label: "Shoes" },
    { id: "outerwear", label: "Outerwear" },
    { id: "accessories", label: "Accessories" },
    { id: "shorts", label: "Shorts" },
    { id: "dresses", label: "Dresses" },
    { id: "skirts", label: "Skirts" },
  ])

  // Update the wardrobe items to reflect a tech professional's style
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItems>({
    shirts: [
      {
        id: 1,
        name: "GitHub Logo T-shirt",
        brand: "GitHub Merch",
        tags: ["casual", "tech", "comfortable"],
        colors: [
          { name: "Black", hex: "#000000" },
          { name: "White", hex: "#FFFFFF" },
        ],
        status: "clean",
        imageUrl:
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&h=800&q=80",
      },
      {
        id: 2,
        name: "Tech Conference Polo",
        brand: "AWS Summit",
        tags: ["semi-casual", "tech event", "professional"],
        colors: [{ name: "Navy", hex: "#000080" }],
        status: "worn",
        imageUrl:
          "https://images.unsplash.com/photo-1618354691373-49944c15aa3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&h=800&q=80",
      },
    ],
    pants: [
      {
        id: 3,
        name: "Dark Wash Developer Jeans",
        brand: "Levi's",
        tags: ["casual", "everyday", "comfortable"],
        colors: [{ name: "Dark Blue", hex: "#00008B" }],
        status: "clean",
        imageUrl:
          "https://images.unsplash.com/photo-1591047139829-d91aecb6ca99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&h=800&q=80",
      },
      {
        id: 4,
        name: "Tech Chinos",
        brand: "Uniqlo",
        tags: ["casual", "work", "stretchy"],
        colors: [{ name: "Khaki", hex: "#C3B091" }],
        status: "clean",
        imageUrl:
          "https://images.unsplash.com/photo-1602810318383-e386cc12b888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&h=800&q=80",
      },
    ],
    shoes: [
      {
        id: 5,
        name: "Coding Comfort Sneakers",
        brand: "Allbirds",
        tags: ["casual", "everyday", "comfortable"],
        colors: [{ name: "Gray", hex: "#808080" }],
        status: "worn",
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&h=800&q=80",
      },
      {
        id: 6,
        name: "Client Meeting Shoes",
        brand: "Clarks",
        tags: ["formal", "meetings", "professional"],
        colors: [{ name: "Brown", hex: "#A52A2A" }],
        status: "clean",
        imageUrl:
          "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&h=800&q=80",
      },
    ],
    outerwear: [
      {
        id: 7,
        name: "Tech Company Hoodie",
        brand: "Google Merch",
        tags: ["casual", "comfortable", "tech", "layering"],
        colors: [{ name: "Gray", hex: "#808080" }],
        status: "clean",
        imageUrl:
          "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&h=800&q=80",
      },
      {
        id: 9,
        name: "Startup Blazer",
        brand: "H&M",
        tags: ["semi-formal", "meetings", "presentations"],
        colors: [{ name: "Navy", hex: "#000080" }],
        status: "clean",
        imageUrl:
          "https://images.unsplash.com/photo-1598808503746-f34faef0e3bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&h=800&q=80",
      },
    ],
    accessories: [
      {
        id: 8,
        name: "Smart Watch",
        brand: "Apple",
        tags: ["tech", "everyday", "productivity"],
        colors: [
          { name: "Black", hex: "#000000" },
          { name: "Silver", hex: "#C0C0C0" },
        ],
        status: "clean",
        imageUrl:
          "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&h=800&q=80",
      },
      {
        id: 10,
        name: "Laptop Backpack",
        brand: "Peak Design",
        tags: ["tech", "everyday", "work", "travel"],
        colors: [{ name: "Black", hex: "#000000" }],
        status: "clean",
        imageUrl:
          "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&h=800&q=80",
      },
      {
        id: 11,
        name: "Noise-Cancelling Headphones",
        brand: "Sony",
        tags: ["tech", "productivity", "focus"],
        colors: [{ name: "Black", hex: "#000000" }],
        status: "clean",
        imageUrl:
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=640&h=800&q=80",
      },
    ],
    shorts: [],
    dresses: [],
    skirts: [],
  })

  // Update the outfits to match the tech professional style
  const [outfits, setOutfits] = useState<Outfit[]>([
    {
      id: 1,
      name: "Remote Work Comfort",
      items: [1, 3, 5, 11], // GitHub T-shirt, Developer Jeans, Comfort Sneakers, Headphones
      occasion: "Work from home",
      weather: "Indoor",
      rating: 0,
      userCreated: false,
    },
    {
      id: 2,
      name: "Tech Meetup Ready",
      items: [2, 4, 6, 8, 10], // Tech Conference Polo, Tech Chinos, Client Meeting Shoes, Smart Watch, Laptop Backpack
      occasion: "Networking",
      weather: "Any",
      rating: 0,
      userCreated: false,
    },
    {
      id: 3,
      name: "Coding Session",
      items: [7, 1, 3, 5, 11], // Tech Hoodie, GitHub T-shirt, Developer Jeans, Comfort Sneakers, Headphones
      occasion: "Focused work",
      weather: "Indoor",
      rating: 0,
      userCreated: false,
    },
    {
      id: 4,
      name: "Client Presentation",
      items: [9, 2, 4, 6, 8], // Startup Blazer, Tech Conference Polo, Tech Chinos, Client Meeting Shoes, Smart Watch
      occasion: "Professional",
      weather: "Any",
      rating: 0,
      userCreated: false,
    },
  ])

  // Update the userSettings initial state to change the name and email
  const [userSettings, setUserSettings] = useState<UserSettings>({
    profile: {
      name: "Noah Ojile",
      email: "noah.ojile@example.com",
      avatar: null,
    },
    notifications: {
      routineReminders: true,
      calendarAlerts: true,
      emailNotifications: false,
      emailAddress: "noah.ojile@example.com",
    },
    appearance: {
      darkMode: true,
      theme: "default",
      fontSize: "medium",
    },
    weatherCondition: "sunny",
    calendar: {
      view: "month",
    },
  })

  // Function to check if a new period has started based on frequency
  const hasNewPeriodStarted = (lastResetDate: Date | undefined, frequency: string): boolean => {
    if (!lastResetDate) return true

    const now = new Date()
    const lastReset = new Date(lastResetDate)

    // Check if dates are the same day
    const isSameDay = (date1: Date, date2: Date) => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      )
    }

    // Check if dates are in the same week
    const isSameWeek = (date1: Date, date2: Date) => {
      const getWeekNumber = (d: Date) => {
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1)
        const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
      }
      return date1.getFullYear() === date2.getFullYear() && getWeekNumber(date1) === getWeekNumber(date2)
    }

    // Check if dates are in the same month
    const isSameMonth = (date1: Date, date2: Date) => {
      return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
    }

    if (frequency === "daily") {
      return !isSameDay(now, lastReset)
    } else if (frequency === "weekly") {
      return !isSameWeek(now, lastReset)
    } else if (frequency === "monthly") {
      return !isSameMonth(now, lastReset)
    }

    return false
  }

  // Function to check and reset routines based on their frequency
  const checkAndResetRoutines = () => {
    const updatedRoutines = routines.map((routine) => {
      // Check if a new period has started
      if (hasNewPeriodStarted(routine.lastResetDate, routine.frequency)) {
        // Check if all tasks were completed before resetting
        const allTasksCompleted = routine.tasks.every((task) => task.completed)

        // Update streak if all tasks were completed
        let newStreak = routine.streak
        if (allTasksCompleted) {
          newStreak += 1
        } else if (routine.lastResetDate) {
          // Reset streak if not all tasks were completed and this isn't the first time
          newStreak = 0
        }

        // Reset tasks and update dates
        return {
          ...routine,
          tasks: routine.tasks.map((task) => ({
            ...task,
            completed: false,
            completedDate: undefined,
            locked: false,
          })),
          progress: 0,
          streak: newStreak,
          lastResetDate: new Date(),
          lastStreakUpdate: allTasksCompleted ? new Date() : routine.lastStreakUpdate,
        }
      }
      return routine
    })

    setRoutines(updatedRoutines)
  }

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      // Load events
      const savedEvents = localStorage.getItem("timelink_events")
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents)
        // Convert string dates back to Date objects
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date),
          recurrenceEndDate: event.recurrenceEndDate ? new Date(event.recurrenceEndDate) : null,
          lastOccurrence: event.lastOccurrence ? new Date(event.lastOccurrence) : undefined,
        }))
        setEvents(eventsWithDates)
      }

      // Load holidays
      const savedHolidays = localStorage.getItem("timelink_holidays")
      if (savedHolidays) {
        const parsedHolidays = JSON.parse(savedHolidays)
        // Convert string dates back to Date objects
        const holidaysWithDates = parsedHolidays.map((holiday: any) => ({
          ...holiday,
          startDate: new Date(holiday.startDate),
          endDate: new Date(holiday.endDate),
        }))
        setHolidays(holidaysWithDates)
      }

      // Load routines
      const savedRoutines = localStorage.getItem("timelink_routines")
      if (savedRoutines) {
        const parsedRoutines = JSON.parse(savedRoutines)
        // Convert string dates back to Date objects
        const routinesWithDates = parsedRoutines.map((routine: any) => ({
          ...routine,
          lastResetDate: routine.lastResetDate ? new Date(routine.lastResetDate) : undefined,
          lastStreakUpdate: routine.lastStreakUpdate ? new Date(routine.lastStreakUpdate) : undefined,
          tasks: routine.tasks.map((task: any) => ({
            ...task,
            completedDate: task.completedDate ? new Date(task.completedDate) : undefined,
          })),
        }))
        setRoutines(routinesWithDates)
      }

      // Load wardrobe categories
      const savedCategories = localStorage.getItem("timelink_wardrobe_categories")
      if (savedCategories) {
        setWardrobeCategories(JSON.parse(savedCategories))
      }

      // Load wardrobe items
      const savedItems = localStorage.getItem("timelink_wardrobe_items")
      if (savedItems) {
        setWardrobeItems(JSON.parse(savedItems))
      }

      // Load outfits
      const savedOutfits = localStorage.getItem("timelink_outfits")
      if (savedOutfits) {
        setOutfits(JSON.parse(savedOutfits))
      }

      // Load user settings
      const savedSettings = localStorage.getItem("timelink_user_settings")
      if (savedSettings) {
        setUserSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error)
    }
  }, [])

  // Check and reset routines when the app loads
  useEffect(() => {
    checkAndResetRoutines()
    // Set up a daily check for routine resets
    const intervalId = setInterval(checkAndResetRoutines, 1000 * 60 * 60) // Check every hour
    return () => clearInterval(intervalId)
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      // Save events
      localStorage.setItem("timelink_events", JSON.stringify(events))

      // Save holidays
      localStorage.setItem("timelink_holidays", JSON.stringify(holidays))

      // Save routines
      localStorage.setItem("timelink_routines", JSON.stringify(routines))

      // Save wardrobe categories
      localStorage.setItem("timelink_wardrobe_categories", JSON.stringify(wardrobeCategories))

      // Save wardrobe items
      localStorage.setItem("timelink_wardrobe_items", JSON.stringify(wardrobeItems))

      // Save outfits
      localStorage.setItem("timelink_outfits", JSON.stringify(outfits))

      // Save user settings
      localStorage.setItem("timelink_user_settings", JSON.stringify(userSettings))
    } catch (error) {
      console.error("Error saving state to localStorage:", error)
    }
  }, [events, holidays, routines, wardrobeCategories, wardrobeItems, outfits, userSettings])

  // Create the context value
  const contextValue: AppStateContextType = {
    events,
    setEvents,
    holidays,
    setHolidays,
    routines,
    setRoutines,
    checkAndResetRoutines,
    wardrobeCategories,
    setWardrobeCategories,
    wardrobeItems,
    setWardrobeItems,
    outfits,
    setOutfits,
    userSettings,
    setUserSettings,
    availableColors,
    availableIcons,
  }

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>
}

// Create a custom hook to use the context
export function useAppState() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}
