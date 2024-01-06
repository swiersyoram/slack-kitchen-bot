export const dateFromTimeInSec = (timeInSec: number): Date => {
    return new Date(timeInSec * 1000);
}