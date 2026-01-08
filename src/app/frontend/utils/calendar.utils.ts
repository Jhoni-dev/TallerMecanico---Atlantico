// src/utils/calendar.utils.ts

export const formatTime = (dateInput: Date | string): string => {
    let date: Date;

    if (dateInput instanceof Date) {
        date = dateInput;
    } else {
        const localDateString = dateInput.replace("Z", "");
        date = new Date(localDateString);
    }

    return date.toLocaleTimeString("es-CO", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export const formatDateKey = (year: number, month: number, day: number): string =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
        daysInMonth: lastDay.getDate(),
        startingDayOfWeek: firstDay.getDay(),
    };
};

export const isCurrentMonth = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

export const isToday = (year: number, month: number, day: number): boolean => {
    return (
        new Date().toDateString() === new Date(year, month, day).toDateString()
    );
};