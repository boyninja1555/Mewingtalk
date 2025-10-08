export function numToMonth(num: number): string {
    return [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ][num]
}

export function formatDate(date: Date): string {
    date = new Date(date)

    const month = numToMonth(date.getMonth())
    return `${month} ${date.getDate()}, ${date.getFullYear()}`
}

export function formatTime(date: Date): string {
    date = new Date(date)

    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12
    hours = hours ? hours : 12
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`
}
