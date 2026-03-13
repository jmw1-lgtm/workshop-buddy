export function normalizeRegistration(input: string) {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidUkRegistration(input: string) {
  return /^[A-Z0-9]{2,8}$/.test(input);
}

export function formatVehicleField(value?: string | null) {
  if (!value) {
    return "";
  }

  return value
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
