/**
 * Date Pattern Service
 *
 * Generates organic-looking publish dates for backdated articles.
 * Creates natural patterns that mimic real blogger behavior.
 */

export type TimeSlot = "morning" | "afternoon" | "evening";

export type PublishDate = {
  date: Date;
  timeSlot: TimeSlot;
};

type OrganicOptions = {
  avgPerWeek: number;
  existingDates?: Date[];
  skipExisting?: boolean;
};

/**
 * Generate organic publish dates within a date range.
 * Mimics natural blogger patterns with weekday bias, morning preference,
 * occasional bursts, and natural gaps.
 */
export function generateOrganicDates(
  startDate: Date,
  endDate: Date,
  options: OrganicOptions
): PublishDate[] {
  const { avgPerWeek, existingDates = [], skipExisting = true } = options;

  // Normalize existing dates to date-only strings for comparison
  const existingDateSet = new Set(
    existingDates.map((d) => d.toISOString().split("T")[0])
  );

  const dates: PublishDate[] = [];
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalWeeks = totalDays / 7;
  const targetCount = Math.round(totalWeeks * avgPerWeek);

  // Generate candidate dates with weighted randomness
  const candidates = generateWeightedCandidates(startDate, endDate, targetCount);

  // Filter and select dates
  for (const candidate of candidates) {
    const dateStr = candidate.toISOString().split("T")[0];

    // Skip if article already exists on this date
    if (skipExisting && existingDateSet.has(dateStr)) {
      continue;
    }

    // Generate time slot with morning bias
    const timeSlot = generateTimeSlot();

    // Apply time to date
    const publishDate = applyTimeSlot(candidate, timeSlot);

    dates.push({ date: publishDate, timeSlot });
  }

  // Sort chronologically
  return dates.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Generate weighted candidate dates.
 * Applies organic patterns: weekday bias, bursts, and gaps.
 */
function generateWeightedCandidates(
  startDate: Date,
  endDate: Date,
  targetCount: number
): Date[] {
  const candidates: Date[] = [];
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Create a probability map for each day
  const dayProbabilities: number[] = [];

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);

    let probability = 1;

    // Weekday bias (70% weekdays, 30% weekends)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      probability *= 0.4; // Weekend penalty
    } else {
      probability *= 1.2; // Weekday boost
    }

    // Tuesday-Thursday are most common for blog posts
    if (dayOfWeek >= 2 && dayOfWeek <= 4) {
      probability *= 1.3;
    }

    // Avoid major US holidays (simplified)
    if (isLikelyHoliday(currentDate)) {
      probability *= 0.1;
    }

    // Add some randomness for natural variation
    probability *= 0.5 + Math.random();

    dayProbabilities.push(probability);
  }

  // Normalize probabilities
  const totalProb = dayProbabilities.reduce((a, b) => a + b, 0);
  const normalizedProbs = dayProbabilities.map((p) => p / totalProb);

  // Select dates based on probability
  // Use reservoir-style selection with probability weighting
  const selected = new Set<number>();

  // Over-select to account for filtering, then trim
  const overSelectFactor = 1.2;
  const selectTarget = Math.min(
    Math.round(targetCount * overSelectFactor),
    totalDays
  );

  while (selected.size < selectTarget) {
    // Weighted random selection
    const rand = Math.random();
    let cumulative = 0;

    for (let i = 0; i < normalizedProbs.length; i++) {
      cumulative += normalizedProbs[i];
      if (rand <= cumulative && !selected.has(i)) {
        selected.add(i);
        break;
      }
    }

    // Fallback to prevent infinite loop
    if (selected.size < selectTarget) {
      const remaining = [...Array(totalDays).keys()].filter(
        (i) => !selected.has(i)
      );
      if (remaining.length === 0) break;
    }
  }

  // Convert indices to dates
  for (const dayIndex of selected) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayIndex);
    candidates.push(date);
  }

  // Apply burst and gap patterns
  return applyBurstGapPatterns(candidates, targetCount);
}

/**
 * Apply burst and gap patterns to make the distribution more organic.
 */
function applyBurstGapPatterns(dates: Date[], targetCount: number): Date[] {
  // Sort dates first
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());

  // If we have too many, randomly remove some
  // Prefer removing from dense clusters
  while (sorted.length > targetCount) {
    // Find clusters (days within 2 days of each other)
    const clusters: number[] = [];
    for (let i = 1; i < sorted.length - 1; i++) {
      const prevDiff = Math.abs(
        sorted[i].getTime() - sorted[i - 1].getTime()
      ) / (1000 * 60 * 60 * 24);
      const nextDiff = Math.abs(
        sorted[i + 1].getTime() - sorted[i].getTime()
      ) / (1000 * 60 * 60 * 24);

      if (prevDiff <= 2 || nextDiff <= 2) {
        clusters.push(i);
      }
    }

    // Remove from cluster if possible, otherwise random
    if (clusters.length > 0) {
      const removeIdx = clusters[Math.floor(Math.random() * clusters.length)];
      sorted.splice(removeIdx, 1);
    } else {
      const removeIdx = Math.floor(Math.random() * sorted.length);
      sorted.splice(removeIdx, 1);
    }
  }

  return sorted;
}

/**
 * Generate a time slot with morning bias.
 * Morning: 50%, Afternoon: 35%, Evening: 15%
 */
function generateTimeSlot(): TimeSlot {
  const rand = Math.random();
  if (rand < 0.5) return "morning";
  if (rand < 0.85) return "afternoon";
  return "evening";
}

/**
 * Apply a time slot to a date with randomization within the slot.
 */
function applyTimeSlot(date: Date, slot: TimeSlot): Date {
  const result = new Date(date);

  let hour: number;
  let minute: number;

  switch (slot) {
    case "morning":
      // 8:00 AM - 11:59 AM, peak around 9-10 AM
      hour = 8 + Math.floor(Math.random() * 4);
      // Bias toward 9-10 AM
      if (Math.random() > 0.5) {
        hour = 9 + Math.floor(Math.random() * 2);
      }
      break;
    case "afternoon":
      // 12:00 PM - 5:59 PM
      hour = 12 + Math.floor(Math.random() * 6);
      break;
    case "evening":
      // 6:00 PM - 9:00 PM (not too late, looks automated)
      hour = 18 + Math.floor(Math.random() * 3);
      break;
  }

  minute = Math.floor(Math.random() * 60);

  result.setHours(hour, minute, 0, 0);
  return result;
}

/**
 * Simple check for likely US holidays.
 * Not exhaustive, just catches the obvious ones.
 */
function isLikelyHoliday(date: Date): boolean {
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  // New Year's Day
  if (month === 0 && day === 1) return true;

  // Independence Day
  if (month === 6 && day === 4) return true;

  // Christmas
  if (month === 11 && (day === 24 || day === 25)) return true;

  // Thanksgiving (rough: 4th Thursday of November)
  if (month === 10 && date.getDay() === 4 && day >= 22 && day <= 28) {
    return true;
  }

  return false;
}

/**
 * Get a summary of the date distribution for display.
 */
export function getDateDistributionSummary(dates: PublishDate[]): {
  total: number;
  byMonth: Record<string, number>;
  byDayOfWeek: Record<string, number>;
  byTimeSlot: Record<TimeSlot, number>;
  avgPerWeek: number;
  dateRange: { start: Date; end: Date } | null;
} {
  if (dates.length === 0) {
    return {
      total: 0,
      byMonth: {},
      byDayOfWeek: {},
      byTimeSlot: { morning: 0, afternoon: 0, evening: 0 },
      avgPerWeek: 0,
      dateRange: null,
    };
  }

  const byMonth: Record<string, number> = {};
  const byDayOfWeek: Record<string, number> = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };
  const byTimeSlot: Record<TimeSlot, number> = {
    morning: 0,
    afternoon: 0,
    evening: 0,
  };
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (const { date, timeSlot } of dates) {
    // Month
    const monthKey = date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
    });
    byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;

    // Day of week
    const dayName = dayNames[date.getDay()];
    byDayOfWeek[dayName]++;

    // Time slot
    byTimeSlot[timeSlot]++;
  }

  // Calculate avg per week
  const start = dates[0].date;
  const end = dates[dates.length - 1].date;
  const weeks =
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7) || 1;
  const avgPerWeek = dates.length / weeks;

  return {
    total: dates.length,
    byMonth,
    byDayOfWeek,
    byTimeSlot,
    avgPerWeek: Math.round(avgPerWeek * 10) / 10,
    dateRange: { start, end },
  };
}

