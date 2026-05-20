// Mirrors the formulas used in client/src/pages/Calculator.tsx so the chatbot's
// answers always agree with the calculator a user can see on screen.

export function calculateTwoWheelerEmission(km) {
  return Number(((km / 35) * 2.31).toFixed(2));
}

export function calculateFourWheelerPetrolEmission(km) {
  return Number(((km / 13) * 2.31).toFixed(2));
}

export function calculateFourWheelerDieselEmission(km) {
  return Number(((km / 15) * 2.31).toFixed(2));
}

// Electricity result is in Tons (matches Calculator.tsx line 78).
export function calculateElectricityCarbonSaved(consumption, nonConsumption) {
  return Number((consumption * nonConsumption * 0.0008541).toFixed(4));
}
