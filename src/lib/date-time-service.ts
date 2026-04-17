import { DateTime } from "luxon";

class DateTimeService {
  formatDateTime(date: Date | string): string {
    if (typeof date === "string") {
      date = new Date(date);
    }

    return DateTime.fromISO(date.toISOString())
      .setZone("Africa/Lagos")
      .toFormat("dd-MM-yyyy HH:mm:ss");
  }

  formatToReadableDate(date: Date | string): string {
    if (typeof date === "string") {
      date = new Date(date);
    }

    return DateTime.fromISO(date.toISOString())
      .setZone("Africa/Lagos")
      .toFormat("dd, LLL yyyy");
  }

  formatToNumericDate(date: Date | string): string {
    if (typeof date === "string") {
      date = new Date(date);
    }

    return DateTime.fromISO(date.toISOString())
      .setZone("Africa/Lagos")
      .toFormat("dd-MM-yyyy");
  }
  formatToNumericDateWithTime(date: Date | string): string {
    if (typeof date === "string") {
      date = new Date(date);
    }

    return DateTime.fromISO(date.toISOString())
      .setZone("Africa/Lagos")
      .toFormat("dd-MM-yyyy | HH:mm"); // day-month-year / hour:minute
  }
}

export const dateTimeService = new DateTimeService();
