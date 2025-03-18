export default class DateUtilComponent {
    
    static addWeekdays(startDate: Date, days: number): Date {
        let count = 0;
        let currentDate = new Date(startDate);
    
        while (count < days) {
            currentDate.setDate(currentDate.getDate() + 1);
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
        }
    
        return currentDate;
    }

    static formatTodaysDate(date: Date): string {

        let day = date.getDate();
        let month = date.toLocaleString('default', {month: 'short'});
        let year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }

    static addDaysAndMonths(days: number, month?: number): string {
        const today = new Date();
        today.setDate(today.getDate() + days);
        if(month) today.setMonth(today.getMonth() + month);
        return this.formatTodaysDate(today);
    }

}

