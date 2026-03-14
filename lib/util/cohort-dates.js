/**
 * Calculates the first Monday of a given month and year.
 */
export function getFirstMonday(month, year) {
    const firstDay = new Date(year, month, 1);
    let day = firstDay.getDay();
    let diff = (day <= 1 ? 1 - day : 8 - day);
    const firstMonday = new Date(year, month, 1 + diff);
    firstMonday.setHours(12, 0, 0, 0); // Set to noon for timezone safety
    return firstMonday;
}

/**
 * Calculates the last Monday of a given month and year.
 */
export function getLastMonday(month, year) {
    const lastDay = new Date(year, month + 1, 0); // Last day of month
    let day = lastDay.getDay();
    let diff = (day >= 1 ? day - 1 : 6);
    const lastMonday = new Date(year, month + 1, 0 - diff);
    lastMonday.setHours(12, 0, 0, 0); // Set to noon for timezone safety
    return lastMonday;
}

/**
 * Checks if registration is currently open for a given month and year.
 */
export function isRegistrationOpen(month, year) {
    const now = new Date();
    const start = getFirstMonday(month, year);
    const deadline = getLastMonday(month, year);

    // Set time to start of day for start, and end of day for deadline
    start.setHours(0, 0, 0, 0);
    deadline.setHours(23, 59, 59, 999);

    return now >= start && now <= deadline;
}

/**
 * Gets the registration countdown in days, hours, minutes.
 */
export function getRegistrationCountdown(deadline) {
    const now = new Date();
    const diff = new Date(deadline) - now;

    if (diff <= 0) return { closed: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return { closed: false, days, hours, minutes };
}
