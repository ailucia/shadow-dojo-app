// The sensei's read-only window into the calendar, via EventKit.
// Usage: calbin [today|tomorrow|week]   (default: today)
//
// Why EventKit and not icalBuddy/AppleScript: icalBuddy reports "No calendars"
// on this machine, and Calendar.app's AppleScript `whose start date ...` filter
// takes ~16s *per calendar* (>45s across all of them) — slow enough that any
// timeout kills it. A compiled EventKit binary returns in well under a second.
// cal.sh compiles this once and caches the binary; it only rebuilds when the
// source changes.

import EventKit
import Foundation

let range = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "today"

let store = EKEventStore()
let sem = DispatchSemaphore(value: 0)
var granted = false
if #available(macOS 14.0, *) {
    store.requestFullAccessToEvents { ok, _ in granted = ok; sem.signal() }
} else {
    store.requestAccess(to: .event) { ok, _ in granted = ok; sem.signal() }
}
sem.wait()
guard granted else {
    FileHandle.standardError.write(Data("DENIED\n".utf8))
    exit(2)
}

let cal = Calendar.current
let startOfToday = cal.startOfDay(for: Date())
var startOffset = 0
var spanDays = 1
switch range {
case "today":    startOffset = 0; spanDays = 1
case "tomorrow": startOffset = 1; spanDays = 1
case "week":     startOffset = 0; spanDays = 7
default:
    FileHandle.standardError.write(Data("usage: cal [today|tomorrow|week]\n".utf8))
    exit(2)
}

let start = cal.date(byAdding: .day, value: startOffset, to: startOfToday)!
let end = cal.date(byAdding: .day, value: spanDays, to: start)!

let pred = store.predicateForEvents(withStart: start, end: end, calendars: nil)
// Dedup identical events that several calendars carry (holidays, shared invites).
var seen = Set<String>()
let events = store.events(matching: pred)
    .sorted { $0.startDate < $1.startDate }
    .filter { ev in
        let key = "\(ev.title ?? "")|\(ev.startDate.timeIntervalSince1970)|\(ev.isAllDay)"
        return seen.insert(key).inserted
    }

let dayFmt = DateFormatter(); dayFmt.dateFormat = "EEE MMM d"
let timeFmt = DateFormatter(); timeFmt.dateFormat = "HH:mm"

if events.isEmpty {
    print("(no events — the \(range) is clear)")
} else {
    var lastDay = ""
    for ev in events {
        // For multi-day ranges, print a date header when the day changes.
        if spanDays > 1 {
            let day = dayFmt.string(from: ev.startDate)
            if day != lastDay { print("\n\(day):"); lastDay = day }
        }
        let when = ev.isAllDay ? "all-day"
            : "\(timeFmt.string(from: ev.startDate))–\(timeFmt.string(from: ev.endDate))"
        print("• \(when)  \(ev.title ?? "(untitled)")")
    }
}
