import { prisma } from '@/lib/prisma';

export const EARLY_BIRD_THRESHOLD = 30;
export const EARLY_BIRD_PRICE = 200000;
export const REGULAR_PRICE = 250000;

/**
 * Gets the current pricing statistics for a specific cohort and program.
 * Only counts 'paid' enrollments towards the early bird limit.
 */
export async function getPricingStats(cohortId, programId) {
    try {
        const paidCount = await prisma.enrollments.count({
            where: {
                cohort_id: cohortId,
                program_id: programId,
                payment_status: 'PAID'
            }
        });

        const isEarlyBirdActive = paidCount < EARLY_BIRD_THRESHOLD;
        const currentPrice = isEarlyBirdActive ? EARLY_BIRD_PRICE : REGULAR_PRICE;
        const slotsRemaining = Math.max(0, EARLY_BIRD_THRESHOLD - paidCount);

        return {
            earlyBirdPrice: EARLY_BIRD_PRICE,
            regularPrice: REGULAR_PRICE,
            currentPrice,
            paidCount,
            slotsRemaining,
            isEarlyBirdActive,
            threshold: EARLY_BIRD_THRESHOLD
        };
    } catch (error) {
        console.error("Error calculating pricing stats:", error);
        return {
            earlyBirdPrice: EARLY_BIRD_PRICE,
            regularPrice: REGULAR_PRICE,
            currentPrice: REGULAR_PRICE,
            paidCount: 0,
            slotsRemaining: 0,
            isEarlyBirdActive: false,
            threshold: EARLY_BIRD_THRESHOLD
        };
    }
}
