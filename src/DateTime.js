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
      },
      set year(v) {
        date.setUTCFullYear(v);
      },
      set month(v) {
        date.setUTCMonth(v - 1);
      },
      set monthName(v) {
        var index = monthNames.indexOf(v);
        if (index < 0) {
            throw new Error("'" + v + "' is not a valid month name.");
        }
        date.setUTCMonth(index);
      },
      set day(v) {
        throw new Error("The property 'day' is readonly.");
      },
      set date(v) {
        date.setUTCDate(v);
      },
      set ordinalDate(v) {
        date.setUTCDate(+v.slice(0, -2));
      },
      set hours(v) {
        date.setUTCHours(v);
      },
      set hours12(v) {
        date.setUTCHours(v % 12);
      },
      set minutes(v) {
        date.setUTCMinutes(v);
      },
      set seconds(v) {
        date.setUTCSeconds(v);
      },
      set ampm(v) {
        if (!/^(am|pm)$/.test(v)) {
            throw new Error("'" + v + "' is not 'am' or 'pm'.");
        }
        if (v !== this.ampm) {
            date.setUTCHours((this.hours + 12) % 24);
        }
      },
      set offset(v) {
        date.setTime(v);
      },
      toString: function (formatString) {
        formatString = formatString || "YYYY-M-D H:m:s";
        return toString(this, formatString);
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
