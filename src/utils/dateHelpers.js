/** Calculates the next occurrence of a recurring class
 * @param {string} day - Day of week
 * @param {string} time - Time range
 * @returns {Date} Next occurrence as JavaScript Date object
 */

export function calculateNextOccurrence(day, time) {
  const parts = time.split(" - ");
  const startTime = parts[0];

  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  const targetDayNumber = dayMap[day];

  const today = new Date();
  const currentDayNumber = today.getDay();
  let daysUntilClass = targetDayNumber - currentDayNumber;

  if (daysUntilClass <= 0) {
    daysUntilClass += 7;
  }

  const [time12, period] = startTime.split(" ");
  const [hours, minutes] = time12.split(":");

  let hours24 = parseInt(hours);
  if (period === "PM" && hours24 !== 12) {
    hours24 += 12;
  } else if (period === "AM" && hours24 === 12) {
    hours24 = 0;
  }

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilClass);
  nextDate.setHours(hours24, parseInt(minutes), 0, 0);

  return nextDate;
}
