export function capitalizeFirstLetter(string) {
  if (!string) return ""; // Handle undefined or null string

  // Convert the first character to uppercase and the rest to lowercase
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
