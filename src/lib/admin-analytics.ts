export function isActivatedDuringTrial(input: {
  firstJobCreatedAt: Date | null;
  trialStartedAt: Date | null;
  trialEndsAt: Date | null;
}) {
  const { firstJobCreatedAt, trialStartedAt, trialEndsAt } = input;

  return Boolean(
    firstJobCreatedAt &&
      trialStartedAt &&
      trialEndsAt &&
      firstJobCreatedAt >= trialStartedAt &&
      firstJobCreatedAt <= trialEndsAt,
  );
}

export function getReturnedStatus(activeDays: number | null) {
  return activeDays == null ? null : activeDays >= 2;
}

export function getMetricPercentage(count: number, total: number) {
  return total > 0 ? (count / total) * 100 : 0;
}
