"use client"

import React from "react"

import { useState, useEffect } from "react"
import { MobileLayout } from "@/components/mobile-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CalendarIcon,
  Tag,
  Search,
  Repeat,
  AlertTriangle,
  Trash2,
  Check,
  PartyPopper,
} from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getIconByName } from "@/lib/holiday-icons"
import { IconSelector } from "@/components/icon-selector"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { holidayIcons, getIconsByCategory, searchIcons, getAllCategories } from "@/lib/holiday-icons-data"

export default function CalendarPage() {
  // Helper function to ensure a valid date object
  const ensureValidDate = (dateObj: any): Date => {
    if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
      return dateObj
    }
    return new Date()
  }

  // Use global state for events and settings
  const { events, setEvents, holidays, setHolidays, userSettings } = useAppState()

  // State for current date and view
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [showHolidayDialog, setShowHolidayDialog] = useState(false)
  const [showHolidayDetails, setShowHolidayDetails] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showIconSelector, setShowIconSelector] = useState(false)

  // First, add state for the view
  const [view, setView] = useState<"day" | "week" | "month" | "year">(userSettings.calendar?.view || "month")

  // Update the calendar view based on state instead of settings
  const calendarView = view

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof events>([])
  const [isSearching, setIsSearching] = useState(false)

  // Event categories
  const eventCategories = ["Work", "Personal", "Health", "Family", "Social", "Other"]

  // State for new/editing event
  const [currentEvent, setCurrentEvent] = useState({
    id: 0,
    title: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    description: "",
    category: "Work",
    isRecurring: false,
    recurrencePattern: "daily" as "daily" | "weekly" | "monthly" | "yearly",
    recurrenceInterval: 1,
    recurrenceDay: [] as number[],
    recurrenceEndDate: null as Date | null,
    skipAutoDelete: false,
  })

  // State for new/editing holiday
  const [currentHoliday, setCurrentHoliday] = useState({
    id: 0,
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    icon: "PartyPopper",
    description: "",
  })

  // Format month and year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Navigate to previous period
  const prevPeriod = () => {
    if (calendarView === "day") {
      setCurrentDate(new Date(currentDate.getTime() - 86400000)) // -1 day
    } else if (calendarView === "week") {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 86400000)) // -7 days
    } else if (calendarView === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else if (calendarView === "year") {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, 0, 1))
    }
  }

  // Navigate to next period
  const nextPeriod = () => {
    if (calendarView === "day") {
      setCurrentDate(new Date(currentDate.getTime() + 86400000)) // +1 day
    } else if (calendarView === "week") {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 86400000)) // +7 days
    } else if (calendarView === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else if (calendarView === "year") {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1))
    }
  }

  // Check if a date is within a holiday range
  const isHoliday = (date: Date) => {
    return holidays.some((holiday) => {
      const startDate = new Date(holiday.startDate)
      const endDate = new Date(holiday.endDate)
      return date >= startDate && date <= endDate
    })
  }

  // Get holiday for a specific date
  const getHolidayForDate = (date: Date) => {
    return holidays.find((holiday) => {
      const startDate = new Date(holiday.startDate)
      const endDate = new Date(holiday.endDate)
      return date >= startDate && date <= endDate
    })
  }

  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: null })
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      const isToday = isSameDay(date, new Date())
      const isSelected = selectedDate && isSameDay(date, selectedDate)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const holiday = getHolidayForDate(date)

      // Get events for this day, including recurring events
      const dayEvents = getEventsForDate(date)

      days.push({
        date: i,
        fullDate: date,
        isToday,
        isSelected,
        isWeekend,
        isHoliday: !!holiday,
        holiday,
        events: dayEvents,
      })
    }

    return days
  }

  // Generate week view
  const generateWeekDays = () => {
    // Get the start of the week (Sunday)
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    const days = []

    // Generate 7 days starting from Sunday
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)

      const isToday = isSameDay(date, new Date())
      const isSelected = selectedDate && isSameDay(date, selectedDate)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const holiday = getHolidayForDate(date)

      // Get events for this day, including recurring events
      const dayEvents = getEventsForDate(date)

      days.push({
        date: date.getDate(),
        fullDate: date,
        isToday,
        isSelected,
        isWeekend,
        isHoliday: !!holiday,
        holiday,
        events: dayEvents,
      })
    }

    return days
  }

  // Generate year view (months)
  const generateYearMonths = () => {
    const year = currentDate.getFullYear()
    const months = []

    for (let i = 0; i < 12; i++) {
      const date = new Date(year, i, 1)
      const monthName = date.toLocaleDateString("en-US", { month: "short" })
      const isCurrentMonth = new Date().getMonth() === i && new Date().getFullYear() === year

      // Count events in this month, including recurring events
      const monthEvents = events.filter((event) => {
        // Check if the event is in this month
        const eventDate = new Date(event.date)
        const isInMonth = eventDate.getMonth() === i && eventDate.getFullYear() === year

        // If it's a direct match or not recurring, return the result
        if (isInMonth || !event.isRecurring) return isInMonth

        // For recurring events, check if any occurrence falls in this month
        return doesRecurringEventOccurInMonth(event, year, i)
      })

      // Check if any holidays fall in this month
      const hasHolidays = holidays.some((holiday) => {
        const startDate = new Date(holiday.startDate)
        const endDate = new Date(holiday.endDate)
        const monthStart = new Date(year, i, 1)
        const monthEnd = new Date(year, i + 1, 0)

        return startDate <= monthEnd && endDate >= monthStart
      })

      months.push({
        month: i,
        name: monthName,
        isCurrentMonth,
        eventCount: monthEvents.length,
        hasHolidays,
      })
    }

    return months
  }

  // Fix the doesRecurringEventOccurInMonth function to correctly check if an event occurs in a month
  const doesRecurringEventOccurInMonth = (event: any, year: number, month: number) => {
    if (!event.isRecurring) return false

    const startDate = new Date(event.date)
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)

    // If the event starts after the end of the month, it doesn't occur
    if (startDate > monthEnd) return false

    // If the event has an end date and it's before the start of the month, it doesn't occur
    if (event.recurrenceEndDate && event.recurrenceEndDate instanceof Date && event.recurrenceEndDate < monthStart)
      return false

    // For daily recurrence
    if (event.recurrencePattern === "daily") {
      // If the event starts before or during the month, it occurs
      return true
    }

    // For weekly recurrence
    if (event.recurrencePattern === "weekly") {
      // Check if any of the recurrence days fall within the month
      const daysInMonth = monthEnd.getDate()

      // If no specific days are selected, use the original event day
      const daysToCheck =
        event.recurrenceDay && event.recurrenceDay.length > 0 ? event.recurrenceDay : [startDate.getDay()]

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        if (daysToCheck.includes(date.getDay())) {
          // Check if this occurrence matches the interval
          if (event.recurrenceInterval === 1) return true

          // If the date is in the same week as the start date, it should occur
          if (isSameWeek(date, startDate)) return true

          // Calculate weeks difference
          const weeksDiff = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
          if (weeksDiff % event.recurrenceInterval === 0) return true
        }
      }
      return false
    }

    // For monthly recurrence
    if (event.recurrencePattern === "monthly") {
      // If the event day is in the month, it occurs
      const eventDay = startDate.getDate()
      if (eventDay <= monthEnd.getDate()) {
        // Check if this month matches the interval
        const monthsDiff = (year - startDate.getFullYear()) * 12 + month - startDate.getMonth()
        return monthsDiff % event.recurrenceInterval === 0
      }
      return false
    }

    // For yearly recurrence
    if (event.recurrencePattern === "yearly") {
      // If the event month is this month, it occurs
      if (startDate.getMonth() === month) {
        // Check if this year matches the interval
        const yearsDiff = year - startDate.getFullYear()
        return yearsDiff % event.recurrenceInterval === 0
      }
      return false
    }

    return false
  }

  // Helper function to check if two dates are in the same week
  const isSameWeek = (date1: Date, date2: Date) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)

    // Set to the start of the day to avoid time issues
    d1.setHours(0, 0, 0, 0)
    d2.setHours(0, 0, 0, 0)

    // Get the first day of the week for each date (Sunday)
    const firstDayOfWeek1 = new Date(d1)
    firstDayOfWeek1.setDate(d1.getDate() - d1.getDay())

    const firstDayOfWeek2 = new Date(d2)
    firstDayOfWeek2.setDate(d2.getDate() - d2.getDay())

    // Compare the first days of the week
    return firstDayOfWeek1.getTime() === firstDayOfWeek2.getTime()
  }

  // Check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  // Get all events for a specific date, including recurring events
  const getEventsForDate = (date: Date) => {
    // Get direct events for this date
    const directEvents = events.filter((event) => isSameDay(new Date(event.date), date))

    // Get recurring events that occur on this date
    const recurringEvents = events.filter((event) => {
      if (!event.isRecurring) return false

      const eventStartDate = new Date(event.date)

      // If the event starts after the target date, it doesn't occur
      if (eventStartDate > date) return false

      // If the event has an end date and it's before the target date, it doesn't occur
      if (event.recurrenceEndDate && event.recurrenceEndDate instanceof Date && event.recurrenceEndDate < date)
        return false

      // Check based on recurrence pattern
      switch (event.recurrencePattern) {
        case "daily":
          // For daily events, check if the interval matches
          if (event.recurrenceInterval === 1) return true

          const daysDiff = Math.floor((date.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24))
          return daysDiff % event.recurrenceInterval === 0

        case "weekly":
          // For weekly events, check if the day of week matches and the interval matches
          if (!event.recurrenceDay || event.recurrenceDay.length === 0) {
            // If no specific days are selected, use the original event day
            if (date.getDay() !== eventStartDate.getDay()) return false
          } else {
            // Check if the current day is in the selected days
            if (!event.recurrenceDay.includes(date.getDay())) return false
          }

          // Calculate weeks difference
          const weeksDiff = Math.floor((date.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24 * 7))

          // If the event is on the same week as the start date, it should occur regardless of interval
          if (
            weeksDiff === 0 &&
            (event.recurrenceDay.includes(date.getDay()) || date.getDay() === eventStartDate.getDay())
          ) {
            return true
          }

          return weeksDiff % event.recurrenceInterval === 0

        case "monthly":
          // For monthly events, check if the day of month matches and the interval matches
          if (eventStartDate.getDate() !== date.getDate()) return false

          const monthsDiff =
            (date.getFullYear() - eventStartDate.getFullYear()) * 12 + date.getMonth() - eventStartDate.getMonth()
          return monthsDiff % event.recurrenceInterval === 0

        case "yearly":
          // For yearly events, check if the month and day match and the interval matches
          if (eventStartDate.getDate() !== date.getDate() || eventStartDate.getMonth() !== date.getMonth()) return false

          const yearsDiff = date.getFullYear() - eventStartDate.getFullYear()
          return yearsDiff % event.recurrenceInterval === 0

        default:
          return false
      }
    })

    // Combine direct and recurring events
    return [...directEvents, ...recurringEvents]
  }

  // Add a function to test if a recurring event occurs on a specific date (for debugging)
  // This can be called from the console to verify recurrence logic
  const testRecurrenceLogic = (eventId: number, testDate: Date) => {
    const event = events.find((e) => e.id === eventId)
    if (!event) {
      console.log("Event not found")
      return false
    }

    if (!event.isRecurring) {
      console.log("Event is not recurring")
      return isSameDay(new Date(event.date), testDate)
    }

    const eventStartDate = new Date(event.date)
    console.log("Event start date:", eventStartDate)
    console.log("Test date:", testDate)

    // If the event starts after the target date, it doesn't occur
    if (eventStartDate > testDate) {
      console.log("Event starts after test date")
      return false
    }

    // If the event has an end date and it's before the target date, it doesn't occur
    if (event.recurrenceEndDate && new Date(event.recurrenceEndDate) < testDate) {
      console.log("Event ended before test date")
      return false
    }

    // Check based on recurrence pattern
    switch (event.recurrencePattern) {
      case "daily":
        // For daily events, check if the interval matches
        if (event.recurrenceInterval === 1) {
          console.log("Daily event with interval 1 - occurs every day")
          return true
        }

        const daysDiff = Math.floor((testDate.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24))
        console.log("Days difference:", daysDiff)
        console.log("Interval:", event.recurrenceInterval)
        console.log("Days diff % interval:", daysDiff % event.recurrenceInterval)
        return daysDiff % event.recurrenceInterval === 0

      case "weekly":
        // For weekly events, check if the day of week matches and the interval matches
        console.log("Weekly event")
        console.log("Event recurrence days:", event.recurrenceDay)
        console.log("Test date day of week:", testDate.getDay())

        if (!event.recurrenceDay || event.recurrenceDay.length === 0) {
          // If no specific days are selected, use the original event day
          if (testDate.getDay() !== eventStartDate.getDay()) {
            console.log("Day of week doesn't match original event day")
            return false
          }
        } else {
          // Check if the current day is in the selected days
          if (!event.recurrenceDay.includes(testDate.getDay())) {
            console.log("Day of week not in selected days")
            return false
          }
        }

        // Calculate weeks difference
        const weeksDiff = Math.floor((testDate.getTime() - eventStartDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
        console.log("Weeks difference:", weeksDiff)
        console.log("Interval:", event.recurrenceInterval)

        // If the event is on the same week as the start date, it should occur regardless of interval
        if (weeksDiff === 0) {
          console.log("Same week as start date")
          return true
        }

        console.log("Weeks diff % interval:", weeksDiff % event.recurrenceInterval)
        return weeksDiff % event.recurrenceInterval === 0

      case "monthly":
        // For monthly events, check if the day of month matches and the interval matches
        console.log("Monthly event")
        console.log("Event day of month:", eventStartDate.getDate())
        console.log("Test date day of month:", testDate.getDate())

        if (eventStartDate.getDate() !== testDate.getDate()) {
          console.log("Day of month doesn't match")
          return false
        }

        const monthsDiff =
          (testDate.getFullYear() - eventStartDate.getFullYear()) * 12 + testDate.getMonth() - eventStartDate.getMonth()
        console.log("Months difference:", monthsDiff)
        console.log("Interval:", event.recurrenceInterval)
        console.log("Months diff % interval:", monthsDiff % event.recurrenceInterval)
        return monthsDiff % event.recurrenceInterval === 0

      case "yearly":
        // For yearly events, check if the month and day match and the interval matches
        console.log("Yearly event")
        console.log("Event month and day:", eventStartDate.getMonth(), eventStartDate.getDate())
        console.log("Test date month and day:", testDate.getMonth(), testDate.getDate())

        if (eventStartDate.getDate() !== testDate.getDate() || eventStartDate.getMonth() !== testDate.getMonth()) {
          console.log("Month and day don't match")
          return false
        }

        const yearsDiff = testDate.getFullYear() - eventStartDate.getFullYear()
        console.log("Years difference:", yearsDiff)
        console.log("Interval:", event.recurrenceInterval)
        console.log("Years diff % interval:", yearsDiff % event.recurrenceInterval)
        return yearsDiff % event.recurrenceInterval === 0

      default:
        console.log("Unknown recurrence pattern")
        return false
    }
  }

  // Make the function available globally for testing
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).testRecurrenceLogic = (eventId: number, dateString: string) => {
        const testDate = new Date(dateString)
        return testRecurrenceLogic(eventId, testDate)
      }
    }
  }, [events])

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setIsSearching(false)
  }

  // Handle month selection in year view
  const handleMonthSelect = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1))
    // Switch to month view after selecting a month
    setView("month")
  }

  // Open new event dialog
  const openNewEventDialog = () => {
    setCurrentEvent({
      id: 0,
      title: "",
      date: selectedDate || new Date(),
      startTime: "09:00",
      endTime: "10:00",
      location: "",
      description: "",
      category: "Work",
      isRecurring: false,
      recurrencePattern: "daily",
      recurrenceInterval: 1,
      recurrenceDay: [],
      recurrenceEndDate: null,
      skipAutoDelete: false,
    })
    setEditMode(false)
    setShowEventDialog(true)
  }

  // Open new holiday dialog
  const openNewHolidayDialog = () => {
    const startDate = selectedDate || new Date()
    const endDate = new Date(startDate)

    setCurrentHoliday({
      id: 0,
      name: "",
      startDate,
      endDate,
      icon: "PartyPopper",
      description: "",
    })
    setEditMode(false)
    setShowHolidayDialog(true)
  }

  // Open event details
  const openEventDetails = (event: any) => {
    setCurrentEvent(event)
    setShowEventDetails(true)
  }

  // Open holiday details
  const openHolidayDetails = (holiday: any) => {
    setCurrentHoliday(holiday)
    setShowHolidayDetails(true)
  }

  // Edit event
  const editEvent = () => {
    setEditMode(true)
    setShowEventDetails(false)
    setShowEventDialog(true)
  }

  // Edit holiday
  const editHoliday = () => {
    setEditMode(true)
    setShowHolidayDetails(false)
    setShowHolidayDialog(true)
  }

  // Save event
  const saveEvent = () => {
    if (currentEvent.title.trim() === "") return

    // Prepare the event object with validated dates
    const eventToSave = {
      ...currentEvent,
      date: ensureValidDate(currentEvent.date),
      recurrenceEndDate: currentEvent.recurrenceEndDate ? ensureValidDate(currentEvent.recurrenceEndDate) : null,
    }

    // If it's a weekly recurrence, ensure we have at least one day selected
    if (
      eventToSave.isRecurring &&
      eventToSave.recurrencePattern === "weekly" &&
      (!eventToSave.recurrenceDay || eventToSave.recurrenceDay.length === 0)
    ) {
      // Default to the day of the selected date
      eventToSave.recurrenceDay = [eventToSave.date.getDay()]
    }

    // Ensure recurrenceInterval is at least 1
    if (eventToSave.isRecurring && (!eventToSave.recurrenceInterval || eventToSave.recurrenceInterval < 1)) {
      eventToSave.recurrenceInterval = 1
    }

    if (editMode) {
      // Update existing event
      setEvents(events.map((event) => (event.id === currentEvent.id ? eventToSave : event)))
    } else {
      // Add new event
      const newId = Math.max(0, ...events.map((e) => e.id)) + 1
      setEvents([...events, { ...eventToSave, id: newId }])
    }

    setShowEventDialog(false)
  }

  // Save holiday
  const saveHoliday = () => {
    if (currentHoliday.name.trim() === "") return

    // Ensure end date is not before start date
    let endDate = new Date(currentHoliday.endDate)
    const startDate = new Date(currentHoliday.startDate)

    if (endDate < startDate) {
      endDate = startDate
    }

    // Prepare the holiday object with validated dates
    const holidayToSave = {
      ...currentHoliday,
      startDate: ensureValidDate(startDate),
      endDate: ensureValidDate(endDate),
    }

    if (editMode) {
      // Update existing holiday
      setHolidays(holidays.map((holiday) => (holiday.id === currentHoliday.id ? holidayToSave : holiday)))
    } else {
      // Add new holiday
      const newId = Math.max(0, ...holidays.map((h) => h.id)) + 1
      setHolidays([...holidays, { ...holidayToSave, id: newId }])
    }

    setShowHolidayDialog(false)
  }

  // State for confirmation dialog
  const [showDeleteEventConfirmation, setShowDeleteEventConfirmation] = useState(false)

  // Delete event with confirmation
  const confirmDeleteEvent = () => {
    setShowDeleteEventConfirmation(true)
  }

  const deleteEvent = () => {
    setEvents(events.filter((event) => event.id !== currentEvent.id))
    setShowEventDetails(false)
    setShowDeleteEventConfirmation(false)
  }

  // State for confirmation dialog
  const [showDeleteHolidayConfirmation, setShowDeleteHolidayConfirmation] = useState(false)

  // Delete holiday with confirmation
  const confirmDeleteHoliday = () => {
    setShowDeleteHolidayConfirmation(true)
  }

  const deleteHoliday = () => {
    setHolidays(holidays.filter((holiday) => holiday.id !== currentHoliday.id))
    setShowHolidayDetails(false)
    setShowDeleteHolidayConfirmation(false)
  }

  // Get events for selected date
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return []
    return getEventsForDate(selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  // Get events for day view (current date)
  const getEventsForDayView = () => {
    return getEventsForDate(currentDate).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  // Get holiday for selected date
  const getHolidayForSelectedDate = () => {
    if (!selectedDate) return null
    return getHolidayForDate(selectedDate)
  }

  // Get color for event category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Work":
        return "border-blue-700"
      case "Personal":
        return "border-purple-700"
      case "Health":
        return "border-green-700"
      case "Family":
        return "border-yellow-700"
      case "Social":
        return "border-pink-700"
      default:
        return "border-gray-700"
    }
  }

  // Search events
  const searchEvents = () => {
    if (!searchQuery.trim()) {
      setIsSearching(false)
      return
    }

    const query = searchQuery.toLowerCase()
    const results = events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query),
    )

    setSearchResults(results)
    setIsSearching(true)
  }

  // Handle search on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchEvents()
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
  }

  // Toggle recurrence for current event
  const toggleRecurrence = (value: boolean) => {
    setCurrentEvent({
      ...currentEvent,
      isRecurring: value,
      // If turning on recurrence, set default values
      recurrencePattern: value ? currentEvent.recurrencePattern || "daily" : "daily",
      recurrenceInterval: value ? currentEvent.recurrenceInterval || 1 : 1,
      recurrenceDay:
        value && currentEvent.recurrencePattern === "weekly"
          ? currentEvent.recurrenceDay && currentEvent.recurrenceDay.length > 0
            ? currentEvent.recurrenceDay
            : [currentEvent.date.getDay()]
          : [],
    })
  }

  // Toggle day selection for weekly recurrence
  const toggleWeekDay = (day: number) => {
    const currentDays = [...(currentEvent.recurrenceDay || [])]
    const index = currentDays.indexOf(day)

    if (index === -1) {
      // Add the day
      currentDays.push(day)
    } else {
      // Remove the day if it's not the last one
      if (currentDays.length > 1) {
        currentDays.splice(index, 1)
      }
    }

    setCurrentEvent({
      ...currentEvent,
      recurrenceDay: currentDays,
    })
  }

  // Auto-delete past events
  useEffect(() => {
    const today = new Date()
    const threeDaysAgo = new Date(today)
    threeDaysAgo.setDate(today.getDate() - 3)

    // Filter out past non-recurring events that should be auto-deleted
    const updatedEvents = events.filter((event) => {
      const eventDate = new Date(event.date)

      // Keep the event if:
      // 1. It's a recurring event, or
      // 2. It's set to skip auto-delete, or
      // 3. It's not older than 3 days
      return event.isRecurring || event.skipAutoDelete || eventDate >= threeDaysAgo
    })

    // Update events if any were removed
    if (updatedEvents.length < events.length) {
      setEvents(updatedEvents)
    }
  }, [events, setEvents])

  // Effect to search when query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setIsSearching(false)
    }
  }, [searchQuery])

  // Get current view title
  const getCurrentViewTitle = () => {
    if (calendarView === "day") {
      return currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    } else if (calendarView === "week") {
      const weekDays = generateWeekDays()
      const startDate = weekDays[0].fullDate
      const endDate = weekDays[6].fullDate
      return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    } else if (calendarView === "month") {
      return formatMonthYear(currentDate)
    } else if (calendarView === "year") {
      return currentDate.getFullYear().toString()
    }
    return ""
  }

  const calendarDays = calendarView === "month" ? generateCalendarDays() : generateWeekDays()
  const yearMonths = calendarView === "year" ? generateYearMonths() : []
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const selectedDateEvents = getEventsForSelectedDate()
  const dayViewEvents = calendarView === "day" ? getEventsForDayView() : []
  const selectedDateHoliday = getHolidayForSelectedDate()

  return (
    <MobileLayout>
      <div className="p-4 space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Calendar</h1>
          <div className="flex space-x-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={openNewHolidayDialog}
              disabled={calendarView === "year" || (!selectedDate && calendarView !== "day")}
              title="Add Holiday"
            >
              <PartyPopper size={18} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={openNewEventDialog}
              disabled={calendarView === "year" || (!selectedDate && calendarView !== "day")}
              title="Add Event"
            >
              <Plus size={20} />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pr-16"
          />
          <div className="absolute right-0 top-0 h-full flex items-center pr-2">
            {searchQuery && (
              <Button variant="ghost" size="icon" className="h-8 w-8 mr-1" onClick={clearSearch}>
                <ChevronLeft size={16} />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={searchEvents}>
              <Search size={16} />
            </Button>
          </div>
        </div>

        {!isSearching ? (
          <>
            {/* View Switcher */}
            <div className="flex flex-col space-y-3">
              {/* View Switcher */}
              <div className="flex justify-center">
                <div className="inline-flex rounded-md shadow-sm">
                  <Button
                    variant={view === "day" ? "default" : "outline"}
                    size="sm"
                    className="rounded-l-md rounded-r-none"
                    onClick={() => setView("day")}
                  >
                    Day
                  </Button>
                  <Button
                    variant={view === "week" ? "default" : "outline"}
                    size="sm"
                    className="rounded-none border-l-0 border-r-0"
                    onClick={() => setView("week")}
                  >
                    Week
                  </Button>
                  <Button
                    variant={view === "month" ? "default" : "outline"}
                    size="sm"
                    className="rounded-none border-r-0"
                    onClick={() => setView("month")}
                  >
                    Month
                  </Button>
                  <Button
                    variant={view === "year" ? "default" : "outline"}
                    size="sm"
                    className="rounded-r-md rounded-l-none"
                    onClick={() => setView("year")}
                  >
                    Year
                  </Button>
                </div>
              </div>

              {/* Period Navigation */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevPeriod}>
                  <ChevronLeft size={16} />
                </Button>
                <h2 className="text-lg font-medium">{getCurrentViewTitle()}</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextPeriod}>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>

            {/* Calendar Views */}
            {calendarView === "month" && (
              <Card className="gradient-card p-4 rounded-xl">
                {/* Days of week */}
                <div className="grid grid-cols-7 mb-3">
                  {daysOfWeek.map((day, index) => (
                    <div
                      key={index}
                      className={`text-center text-sm font-medium py-1 ${
                        index === 0 || index === 6 ? "text-muted-foreground" : ""
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <CalendarDay
                      key={index}
                      day={day}
                      onSelect={day.fullDate ? () => handleDateSelect(day.fullDate) : undefined}
                    />
                  ))}
                </div>
              </Card>
            )}

            {calendarView === "week" && (
              <Card className="gradient-card p-4 rounded-xl">
                {/* Days of week */}
                <div className="grid grid-cols-7 mb-3">
                  {daysOfWeek.map((day, index) => (
                    <div
                      key={index}
                      className={`text-center text-sm font-medium py-1 ${
                        index === 0 || index === 6 ? "text-muted-foreground" : ""
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Week days */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => (
                    <CalendarDay key={index} day={day} onSelect={() => handleDateSelect(day.fullDate)} isWeekView />
                  ))}
                </div>
              </Card>
            )}

            {calendarView === "year" && (
              <Card className="gradient-card p-4 rounded-xl">
                <div className="grid grid-cols-3 gap-4">
                  {yearMonths.map((month) => (
                    <div
                      key={month.month}
                      className={`p-4 rounded-md text-center cursor-pointer hover:bg-secondary/50 ${
                        month.isCurrentMonth ? "bg-primary/20" : ""
                      }`}
                      onClick={() => handleMonthSelect(month.month)}
                    >
                      <div className="font-medium text-base">{month.name}</div>
                      <div className="flex flex-col items-center mt-1 text-xs">
                        {month.eventCount > 0 && <div className="text-primary">{month.eventCount} events</div>}
                        {month.hasHolidays && (
                          <div className="text-rose-500 flex items-center">
                            <PartyPopper size={10} className="mr-1" /> Holidays
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {calendarView === "day" && (
              <Card className="gradient-card p-4 rounded-xl">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Events for Today</h3>

                  {dayViewEvents.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">No events scheduled for today</div>
                  ) : (
                    <div className="space-y-3">
                      {dayViewEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          categoryColor={getCategoryColor(event.category)}
                          onClick={() => openEventDetails(event)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Selected Date Events (for month and week views) */}
            {selectedDate && calendarView !== "day" && calendarView !== "year" && (
              <div className="space-y-4 mt-4">
                <h2 className="text-lg font-medium">
                  {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </h2>

                {/* Show holiday if present */}
                {selectedDateHoliday && (
                  <Card
                    className="p-4 rounded-xl cursor-pointer hover:bg-accent/10"
                    onClick={() => openHolidayDetails(selectedDateHoliday)}
                  >
                    <div className="flex items-center">
                      {React.createElement(getIconByName(selectedDateHoliday.icon), { size: 20, className: "mr-2" })}
                      <div>
                        <h3 className="font-medium">{selectedDateHoliday.name}</h3>
                        {selectedDateHoliday.description && (
                          <p className="text-sm text-muted-foreground">{selectedDateHoliday.description}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {selectedDateEvents.length === 0 ? (
                  <Card className="gradient-card-secondary p-5 rounded-xl text-center">
                    <p className="text-muted-foreground">No events scheduled</p>
                    <div className="flex justify-center gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={openNewEventDialog}>
                        <Plus size={16} className="mr-1" /> Add Event
                      </Button>
                      <Button variant="outline" size="sm" onClick={openNewHolidayDialog}>
                        <PartyPopper size={16} className="mr-1" /> Add Holiday
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        categoryColor={getCategoryColor(event.category)}
                        onClick={() => openEventDetails(event)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Search Results */
          <div className="space-y-3">
            <h2 className="text-lg font-medium">Search Results ({searchResults.length})</h2>

            {searchResults.length === 0 ? (
              <Card className="gradient-card-secondary p-4 rounded-xl text-center">
                <p className="text-muted-foreground">No events found matching "{searchQuery}"</p>
              </Card>
            ) : (
              searchResults.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  categoryColor={getCategoryColor(event.category)}
                  onClick={() => openEventDetails(event)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* New/Edit Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Event" : "Add New Event"}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="recurrence">Recurrence</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  value={currentEvent.title}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                  placeholder="e.g., Team Meeting"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-date">Date</Label>
                  <div className="flex">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {currentEvent.date ? format(currentEvent.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={currentEvent.date}
                          onSelect={(date) => date && setCurrentEvent({ ...currentEvent, date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-start">Start Time</Label>
                  <Select
                    value={currentEvent.startTime}
                    onValueChange={(value) => setCurrentEvent({ ...currentEvent, startTime: value })}
                  >
                    <SelectTrigger id="event-start">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-72">
                        {Array.from({ length: 24 * 4 }).map((_, i) => {
                          const hour = Math.floor(i / 4)
                          const minute = (i % 4) * 15
                          const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
                          return (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          )
                        })}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-end">End Time</Label>
                  <Select
                    value={currentEvent.endTime}
                    onValueChange={(value) => setCurrentEvent({ ...currentEvent, endTime: value })}
                  >
                    <SelectTrigger id="event-end">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-72">
                        {Array.from({ length: 24 * 4 }).map((_, i) => {
                          const hour = Math.floor(i / 4)
                          const minute = (i % 4) * 15
                          const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
                          return (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          )
                        })}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-category">Category</Label>
                <Select
                  value={currentEvent.category}
                  onValueChange={(value) => setCurrentEvent({ ...currentEvent, category: value })}
                >
                  <SelectTrigger id="event-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  value={currentEvent.location}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                  placeholder="e.g., Conference Room A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={currentEvent.description}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                  placeholder="Event details..."
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="skip-auto-delete"
                  checked={currentEvent.skipAutoDelete}
                  onCheckedChange={(checked) => setCurrentEvent({ ...currentEvent, skipAutoDelete: checked })}
                />
                <Label htmlFor="skip-auto-delete" className="cursor-pointer">
                  Keep this event in calendar history (prevent auto-deletion)
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="recurrence" className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Switch id="is-recurring" checked={currentEvent.isRecurring} onCheckedChange={toggleRecurrence} />
                <Label htmlFor="is-recurring" className="cursor-pointer">
                  Repeat this event
                </Label>
              </div>

              {currentEvent.isRecurring && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="recurrence-pattern">Repeat</Label>
                    <Select
                      value={currentEvent.recurrencePattern}
                      onValueChange={(value: "daily" | "weekly" | "monthly" | "yearly") =>
                        setCurrentEvent({
                          ...currentEvent,
                          recurrencePattern: value,
                          // Reset recurrence days if not weekly
                          recurrenceDay:
                            value === "weekly"
                              ? currentEvent.recurrenceDay.length > 0
                                ? currentEvent.recurrenceDay
                                : [currentEvent.date.getDay()]
                              : [],
                        })
                      }
                    >
                      <SelectTrigger id="recurrence-pattern">
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recurrence-interval">
                      {currentEvent.recurrencePattern === "daily" && "Every"}
                      {currentEvent.recurrencePattern === "weekly" && "Every"}
                      {currentEvent.recurrencePattern === "monthly" && "Every"}
                      {currentEvent.recurrencePattern === "yearly" && "Every"}
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="recurrence-interval"
                        type="number"
                        min="1"
                        max="99"
                        value={currentEvent.recurrenceInterval}
                        onChange={(e) =>
                          setCurrentEvent({
                            ...currentEvent,
                            recurrenceInterval: Math.max(1, Number.parseInt(e.target.value) || 1),
                          })
                        }
                        className="w-20"
                      />
                      <span>
                        {currentEvent.recurrencePattern === "daily" &&
                          `day${currentEvent.recurrenceInterval > 1 ? "s" : ""}`}
                        {currentEvent.recurrencePattern === "weekly" &&
                          `week${currentEvent.recurrenceInterval > 1 ? "s" : ""}`}
                        {currentEvent.recurrencePattern === "monthly" &&
                          `month${currentEvent.recurrenceInterval > 1 ? "s" : ""}`}
                        {currentEvent.recurrencePattern === "yearly" &&
                          `year${currentEvent.recurrenceInterval > 1 ? "s" : ""}`}
                      </span>
                    </div>
                  </div>

                  {currentEvent.recurrencePattern === "weekly" && (
                    <div className="space-y-2">
                      <Label>Repeat on</Label>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map((day, index) => (
                          <Button
                            key={day}
                            type="button"
                            variant={
                              currentEvent.recurrenceDay && currentEvent.recurrenceDay.includes(index)
                                ? "default"
                                : "outline"
                            }
                            className="w-10 h-10 p-0 rounded-full"
                            onClick={() => toggleWeekDay(index)}
                          >
                            {day.charAt(0)}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Select at least one day of the week when this event should occur.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="recurrence-end">End</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="never-end"
                          checked={currentEvent.recurrenceEndDate === null}
                          onChange={() => setCurrentEvent({ ...currentEvent, recurrenceEndDate: null })}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="never-end" className="cursor-pointer">
                          Never
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="end-on-date"
                          checked={currentEvent.recurrenceEndDate !== null}
                          onChange={() => {
                            // Set default end date to 1 month from start if not set
                            const defaultEndDate = new Date(currentEvent.date)
                            defaultEndDate.setMonth(defaultEndDate.getMonth() + 1)
                            setCurrentEvent({
                              ...currentEvent,
                              recurrenceEndDate: currentEvent.recurrenceEndDate || defaultEndDate,
                            })
                          }}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="end-on-date" className="cursor-pointer">
                          On date
                        </Label>

                        {currentEvent.recurrenceEndDate !== null && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="ml-2 justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {currentEvent.recurrenceEndDate instanceof Date
                                  ? format(currentEvent.recurrenceEndDate, "PPP")
                                  : "Select end date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={
                                  currentEvent.recurrenceEndDate instanceof Date
                                    ? currentEvent.recurrenceEndDate
                                    : undefined
                                }
                                onSelect={(date) =>
                                  date && setCurrentEvent({ ...currentEvent, recurrenceEndDate: date })
                                }
                                initialFocus
                                disabled={(date) => date < currentEvent.date}
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="destructive" className="w-full sm:w-auto" onClick={confirmDeleteEvent}>
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
            <div className="flex gap-3 w-full sm:w-auto sm:ml-auto">
              <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => setShowEventDialog(false)}>
                Cancel
              </Button>
              <Button className="flex-1 sm:flex-initial" onClick={saveEvent}>
                <Check size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New/Edit Holiday Dialog */}
      <Dialog open={showHolidayDialog} onOpenChange={setShowHolidayDialog}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Holiday" : "Add New Holiday"}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="icon">Icon</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="holiday-name">Holiday Name</Label>
                <Input
                  id="holiday-name"
                  value={currentHoliday.name}
                  onChange={(e) => setCurrentHoliday({ ...currentHoliday, name: e.target.value })}
                  placeholder="e.g., Christmas"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="holiday-start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentHoliday.startDate ? format(currentHoliday.startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={currentHoliday.startDate}
                        onSelect={(date) =>
                          date &&
                          setCurrentHoliday({
                            ...currentHoliday,
                            startDate: date,
                            // If end date is before start date, set it to start date
                            endDate: currentHoliday.endDate < date ? date : currentHoliday.endDate,
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="holiday-end-date">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentHoliday.endDate ? format(currentHoliday.endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={currentHoliday.endDate}
                        onSelect={(date) => date && setCurrentHoliday({ ...currentHoliday, endDate: date })}
                        initialFocus
                        disabled={(date) => date < currentHoliday.startDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="holiday-description">Description (Optional)</Label>
                <Textarea
                  id="holiday-description"
                  value={currentHoliday.description}
                  onChange={(e) => setCurrentHoliday({ ...currentHoliday, description: e.target.value })}
                  placeholder="Add details about this holiday..."
                  className="resize-none"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="icon" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Selected Icon</Label>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    {React.createElement(getIconByName(currentHoliday.icon), { size: 20, className: "text-primary" })}
                  </div>
                  <span className="text-sm">{currentHoliday.icon}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Choose Icon</Label>
                <Button variant="outline" onClick={() => setShowIconSelector(true)} className="w-full justify-start">
                  Select Holiday Icon
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="destructive" className="w-full sm:w-auto" onClick={confirmDeleteHoliday}>
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
            <div className="flex gap-3 w-full sm:w-auto sm:ml-auto">
              <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => setShowHolidayDialog(false)}>
                Cancel
              </Button>
              <Button className="flex-1 sm:flex-initial" onClick={saveHoliday}>
                <Check size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Icon Selector Dialog */}
      <IconSelector
        open={showIconSelector}
        onOpenChange={setShowIconSelector}
        selectedIcon={currentHoliday.icon}
        onSelectIcon={(iconName) => setCurrentHoliday({ ...currentHoliday, icon: iconName })}
        icons={holidayIcons}
        getIconsByCategory={getIconsByCategory}
        searchIcons={searchIcons}
        getAllCategories={getAllCategories}
        title="Select Holiday Icon"
      />

      {/* Event Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteEventConfirmation}
        onOpenChange={setShowDeleteEventConfirmation}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        onConfirm={deleteEvent}
      />

      {/* Holiday Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteHolidayConfirmation}
        onOpenChange={setShowDeleteHolidayConfirmation}
        title="Delete Holiday"
        description="Are you sure you want to delete this holiday? This action cannot be undone."
        onConfirm={deleteHoliday}
      />

      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentEvent.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center text-sm">
              <CalendarIcon size={16} className="mr-2 text-primary" />
              {currentEvent.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>

            {currentEvent.isRecurring && (
              <div className="flex items-center text-sm text-primary">
                <Repeat size={16} className="mr-2" />
                {currentEvent.recurrencePattern === "daily" &&
                  `Every ${currentEvent.recurrenceInterval > 1 ? currentEvent.recurrenceInterval : ""} day${
                    currentEvent.recurrenceInterval > 1 ? "s" : ""
                  }`}
                {currentEvent.recurrencePattern === "weekly" && (
                  <span>
                    Every {currentEvent.recurrenceInterval > 1 ? currentEvent.recurrenceInterval : ""} week
                    {currentEvent.recurrenceInterval > 1 ? "s" : ""} on{" "}
                    {currentEvent.recurrenceDay && currentEvent.recurrenceDay.length > 0
                      ? currentEvent.recurrenceDay
                          .sort()
                          .map((day) => daysOfWeek[day])
                          .join(", ")
                      : daysOfWeek[currentEvent.date.getDay()]}
                  </span>
                )}
                {currentEvent.recurrencePattern === "monthly" &&
                  `Every ${currentEvent.recurrenceInterval > 1 ? currentEvent.recurrenceInterval : ""} month${
                    currentEvent.recurrenceInterval > 1 ? "s" : ""
                  } on day ${currentEvent.date.getDate()}`}
                {currentEvent.recurrencePattern === "yearly" &&
                  `Every ${currentEvent.recurrenceInterval > 1 ? currentEvent.recurrenceInterval : ""} year${
                    currentEvent.recurrenceInterval > 1 ? "s" : ""
                  } on ${currentEvent.date.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`}
                {currentEvent.recurrenceEndDate && (
                  <span className="ml-1">
                    until{" "}
                    {currentEvent.recurrenceEndDate instanceof Date
                      ? currentEvent.recurrenceEndDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center text-sm">
              <Clock size={16} className="mr-2 text-primary" />
              {currentEvent.startTime} - {currentEvent.endTime}
            </div>

            {currentEvent.location && (
              <div className="flex items-start text-sm">
                <div className="mr-2 mt-0.5">📍</div>
                <div>{currentEvent.location}</div>
              </div>
            )}

            <div className="flex items-center text-sm">
              <Tag size={16} className="mr-2 text-primary" />
              {currentEvent.category}
            </div>

            {currentEvent.description && (
              <div className="mt-4 text-sm">
                <p className="text-muted-foreground mb-1">Description:</p>
                <p>{currentEvent.description}</p>
              </div>
            )}

            {currentEvent.skipAutoDelete && (
              <div className="flex items-center text-sm text-amber-500">
                <AlertTriangle size={16} className="mr-2" />
                This event is set to be kept in calendar history
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => setShowEventDetails(false)}>
              Close
            </Button>
            <Button className="flex-1 sm:flex-initial" onClick={editEvent}>
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Holiday Details Dialog */}
      <Dialog open={showHolidayDetails} onOpenChange={setShowHolidayDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentHoliday.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center text-sm">
              <CalendarIcon size={16} className="mr-2 text-primary" />
              {format(new Date(currentHoliday.startDate), "PPP")}
              {!isSameDay(new Date(currentHoliday.startDate), new Date(currentHoliday.endDate)) && (
                <> - {format(new Date(currentHoliday.endDate), "PPP")}</>
              )}
            </div>

            <div className="flex items-center justify-center p-4">
              {React.createElement(getIconByName(currentHoliday.icon), { size: 48 })}
            </div>

            {currentHoliday.description && (
              <div className="mt-2 text-sm">
                <p className="text-muted-foreground mb-1">Description:</p>
                <p>{currentHoliday.description}</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => setShowHolidayDetails(false)}>
              Close
            </Button>
            <Button className="flex-1 sm:flex-initial" onClick={editHoliday}>
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  )
}

// Fix the CalendarDay component to better display recurring events and holidays
function CalendarDay({
  day,
  onSelect,
  isWeekView = false,
}: {
  day: any
  onSelect?: () => void
  isWeekView?: boolean
}) {
  if (!day.date) {
    return <div className="h-14"></div>
  }

  const hasEvents = day.events && day.events.length > 0
  const hasRecurringEvents = day.events && day.events.some((event: any) => event.isRecurring)
  const isHoliday = day.isHoliday

  // Get holiday icon
  const HolidayIcon = isHoliday ? getIconByName(day.holiday.icon) : null

  return (
    <div
      className={`${isWeekView ? "h-32" : "h-16"} rounded-md flex flex-col items-center justify-start p-2 relative 
        ${day.isToday ? "bg-primary/20" : day.isSelected ? "bg-secondary" : "hover:bg-secondary/50"} 
        ${day.isWeekend ? "text-muted-foreground" : ""} 
        ${onSelect ? "cursor-pointer" : ""} transition-colors`}
      onClick={onSelect}
    >
      <span className={`text-sm ${day.isToday ? "font-bold text-primary" : day.isSelected ? "font-bold" : ""}`}>
        {day.date}
      </span>

      {/* Holiday indicator */}
      {isHoliday && !isWeekView && (
        <div className="absolute top-1 right-1">
          {HolidayIcon && React.createElement(HolidayIcon, { size: 10, className: "text-rose-500" })}
        </div>
      )}

      {/* Holiday name in week view */}
      {isHoliday && isWeekView && (
        <div className="text-xs text-rose-500 flex items-center mt-1 w-full justify-center">
          {HolidayIcon && React.createElement(HolidayIcon, { size: 10, className: "mr-1" })}
          <span className="truncate">{day.holiday.name}</span>
        </div>
      )}

      {/* Event indicators */}
      {hasEvents && (
        <div className={`flex flex-col gap-1 mt-auto ${isWeekView ? "w-full" : ""}`}>
          {isWeekView ? (
            // Show mini event cards in week view
            day.events
              .slice(0, 3)
              .map((event: any, index: number) => (
                <div
                  key={`${event.id}-${index}`}
                  className={`text-xs truncate px-1.5 py-0.5 rounded ${
                    event.isRecurring ? "bg-primary/30" : "bg-primary/20"
                  } w-full text-center flex items-center justify-center`}
                  title={`${event.title}${event.isRecurring ? " (Recurring)" : ""}`}
                >
                  {event.isRecurring && <Repeat size={10} className="mr-1 flex-shrink-0" />}
                  <span className="truncate">
                    {event.startTime} {event.title}
                  </span>
                </div>
              ))
          ) : // Show number for more than 3 events, otherwise show dots
          day.events.length > 3 ? (
            <div className="text-xs font-medium text-primary mt-1 flex items-center">
              {hasRecurringEvents && <Repeat size={10} className="mr-1" />}
              {day.events.length} events
            </div>
          ) : (
            <div className="flex flex-col items-center mt-1 gap-1">
              {day.events.map((event: any, index: number) => (
                <div
                  key={`${event.id}-${index}`}
                  className={`w-2 h-2 rounded-full ${event.isRecurring ? "bg-primary/80" : "bg-primary"}`}
                  title={`${event.title}${event.isRecurring ? " (Recurring)" : ""}`}
                />
              ))}
            </div>
          )}

          {/* Show count of additional events if there are more than can be displayed */}
          {isWeekView && day.events.length > 3 && (
            <div className="text-xs text-primary text-center flex items-center justify-center">
              {hasRecurringEvents && <Repeat size={10} className="mr-1" />}+{day.events.length - 3} more
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EventCard({
  event,
  categoryColor,
  onClick,
}: {
  event: any
  categoryColor: string
  onClick: () => void
}) {
  return (
    <Card
      className={`gradient-card-secondary p-4 rounded-xl border-l-4 ${categoryColor} cursor-pointer hover:bg-accent/10 transition-colors`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium flex items-center">
            {event.title}
            {event.isRecurring && <Repeat size={14} className="ml-2 text-primary" />}
          </h3>
          {event.location && (
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <span className="mr-1">📍</span> {event.location}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">
            {event.startTime} - {event.endTime}
          </span>
          <div className="flex items-center mt-2">
            <span className="text-xs px-2 py-1 rounded-full bg-secondary">{event.category}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
