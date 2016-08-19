"use_strict";

var DateTime = (function() {

  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function createDateTime(date) {
    return {

      get year() {
        return date.getUTCFullYear();
      },
      get monthName() {
        return monthNames[date.getUTCMonth()];
      },
      get month() {
        return date.getUTCMonth() + 1;
      },
      get day() {
        return dayNames[date.getUTCDay()];
      },
      get date() {
        return date.getDate();
      },
      get ordinalDate() {
        var n = this.date;
        var suffix = "th";
        if (n < 4 || n > 20) {
          suffix = ["st", "nd", "rd"][n % 10 - 1] || suffix;
        }
        return n + suffix;
      },
      get hours() {
        return date.getUTCHours();
      },
      get hours12() {
        return this.hours % 12 || 12;
      },
      get minutes() {
        return date.getUTCMinutes();
      },
      get seconds() {
        return date.getUTCSeconds();
      },
      get ampm() {
        return this.hours < 12 ? "am" : "pm";
      },
      get offset() {
        return date.getTime();
      }
    };
  }

  return function(date) {
    if (date !== undefined) {
      if (date instanceof Date) {
        return createDateTime(date);
      }
      throw new Error(String(date) + "is not a date object.");
    }
    return createDateTime(new Date());
  };
})();
