class Task {
    title;
    type;
    frequency
    daysOfWeek;
    dueDate;
    timeOfDay
    advanceMinutes;
    active;
    timezone;
    constructor( title, type, frequency, daysOfWeek, dueDate, timeOfDay, advanceMinutes, active, timezone ){
        this.title = title;
        this.type = type;
        this.frequency = frequency;
        this.daysOfWeek = daysOfWeek;
        this.dueDate = dueDate;
        this.timeOfDay = timeOfDay;
        this.advanceMinutes = advanceMinutes;
        this.active = active;
        this.timezone = timezone;
    }
}