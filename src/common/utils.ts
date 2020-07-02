export function addDays(date: Date, days: number): Date {
    const tmp = new Date(date.valueOf())
    tmp.setDate(date.getDate() + days)
    return tmp
}
