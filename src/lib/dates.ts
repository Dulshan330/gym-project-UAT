export function getExpireDate(
  inputDate: string,
  monthsToAdd: number
): string {
  // Parse the input date
  const date = new Date(inputDate);

  // Validate the input date
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD format.");
  }

  // Create a new date object
  const newDate = new Date(date);
  
  // Get the original day of the month
  const originalDay = date.getDate();
  
  // Add the months
  newDate.setMonth(newDate.getMonth() + monthsToAdd);
  
  // If we've crossed a month boundary and the new day is different,
  // subtract one day to get the last day of the previous month
  if (newDate.getDate() !== originalDay) {
    newDate.setDate(0); // Sets to last day of previous month
  } else {
    // If we're on the same day, subtract one day to get the day before
    newDate.setDate(newDate.getDate() - 1);
  }

  // Format the result as YYYY-MM-DD
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const formatShortDate = (date: Date) => {
  // Returns YYYY.MM.DD
  return `${date.getFullYear()}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
};