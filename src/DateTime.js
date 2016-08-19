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
  var formatAbbreviations = {
         YYYY: "year",
         YY: "shortYear",
         MMMM: "monthName",
         M: "month",
         dddd: "day",
         D: "date",
         Do: "ordinalDate",
         H: "hours",
         h: "hours12",
         m: "minutes",
         s: "seconds",
         a: "ampm"
     };
     var maxAbbreviationLength = 4;
     var formatPatterns = {
         year: /^-?[0-9]+/,
         monthName: /January|February|March|April|May|June|July|August|September|October|November|December/,
         month: /[1-9][0-9]?/,
         day: /Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday/,
         date: /[1-9][0-9]?/,
         ordinalDate: /[1-9][0-9]?(st|nd|rd|th)/,
         hours: /[0-9]{1,2}/,
         hours12: /[0-9]{1,2}/,
         minutes: /[0-9]{1,2}/,
         seconds: /[0-9]{1,2}/,
         ampm: /am|pm/
     };


     function tokenize(formatString) {
         var tokens = [];
         for (var i = 0; i < formatString.length; i++) {
             var slice, propertyName;
             for (var j = maxAbbreviationLength; j > 0; j--) {
                 slice = formatString.slice(i, i + j);
                 propertyName = formatAbbreviations[slice];
                 if (propertyName) {
                     tokens.push({ type: "property", value: propertyName });
                     i += j - 1;
                     break;
                 }
             }
             if (!propertyName) {
                 tokens.push({ type: "literal", value: slice });
             }
         }
         return tokens;
     }

     function toString(dateTime, formatString) {
         var tokens = tokenize(formatString);
         return tokens.map(function (token) {
             if (token.type === "property") {
                 var value = dateTime[token.value];
                 if (token.value === "minutes" || token.value === "seconds") {
                     value = ("00" + value).slice(-2);
                 }
                 return value;
             }
             return token.value;
         }).join("");
     }

     function parse(string, formatString) {
         var tokens = tokenize(formatString);
         var properties = {};
         tokens.forEach(function (token, i) {
             if (token.type === "literal") {
                 var value = token.value,
                     slice = string.slice(0, value.length);
                 if (slice !== value) {
                     throw new Error("String does not match format. Expected '" + slice + "' to equal '" + value + "'.");
                 }
                 string = string.slice(value.length);
             } else {
                 var format = token.value,
                     pattern = formatPatterns[format],
                     match = string.match(pattern);
                 if (!match || !match.length) {
                     throw new Error("String does not match format. Expected '" + string + "' to start with the pattern " + pattern + ".");
                 }
                 match = match[0];
                 string = string.slice(match.length);
                 properties[format] = match;
             }
         });
         var propertyOrder = ["seconds", "minutes", "hours12", "ampm", "hours", "ordinalDate", "date", "monthName", "month", "year"];
         var date = createDateTime(new Date(0));
         propertyOrder.forEach(function (property) {
             if (properties[property]) {
                 date[property] = properties[property];
             }
         });
         return date;
     }

     return function (date, formatString) {
         if (date !== undefined) {
             if (date instanceof Date) {
                 return createDateTime(date);
             }
             if (typeof formatString === "string") {
                 return parse(date, formatString);
             }
             throw new Error(String(date) + " is not a Date object.");
         }
         return createDateTime(new Date());
     };
 })();
