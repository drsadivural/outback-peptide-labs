export function calculateAge(dob: string, now: Date = new Date()): number {
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return NaN
  let age = now.getUTCFullYear() - birth.getUTCFullYear()
  const monthDiff = now.getUTCMonth() - birth.getUTCMonth()
  const dayDiff = now.getUTCDate() - birth.getUTCDate()
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--
  return age
}

export function isAdult(dob: string, now: Date = new Date()): boolean {
  const age = calculateAge(dob, now)
  return Number.isFinite(age) && age >= 18
}
