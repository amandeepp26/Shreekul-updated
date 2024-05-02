export function calculateAge(dob) {
  // Split the DOB into year, month, and day
  const dobParts = dob.split('-');
  const dobYear = parseInt(dobParts[0], 10);
  const dobMonth = parseInt(dobParts[1], 10) - 1; // Months are 0-indexed
  const dobDay = parseInt(dobParts[2], 10);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference between the current date and DOB
  const ageDate = new Date(currentDate - new Date(dobYear, dobMonth, dobDay));

  // Extract the year from the difference to get the age
  const age = ageDate.getUTCFullYear() - 1970;

  return age;
}
