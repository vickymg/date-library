describe("DateTime", function() {
  it("returns the current time when called with no arguments", function() {
    var lowerLimit = new Date().getTime(),
      offset = DateTime().offset,
      upperLimit = new Date().getTime();
    expect(offset).not.toBeLessThan(lowerLimit);
    expect(offset).not.toBeGreaterThan(upperLimit);
  });

  it("matches the passed in date when called with one argument", function() {
    var dates = [new Date(), new Date(0), new Date(864e13), new Date(-864e13)];
    for (var i = 0; i < dates.length; i++) {
      expect(DateTime(dates[i]).offset).toEqual(dates[i].getTime());
    }
  });

  it("throws an error when called with a single non-date argument", function() {
    var nonDates = [0, NaN, Infinity, "", "not a date", null, /regex/, {}, []];
    for (var i = 0; i < nonDates.length; i++ ) {
      expect(DateTime.bind(null, nonDates[i])).toThrow();
    }
  });

  it("throws a NaN offset when an invalid date is passed in", function() {
    var invalidDates = [new Date(864e13 + 1), new Date(-1e99), new Date("xyz")];
    for (var i = 0; i < invalidDates.length; i++ ) {
      expect(isNaN(DateTime(invalidDates[i]).offset)).toBe(true);
    }
  });

  var testDates = [
      "0001-01-01T00:00:00", // Monday
      "0021-02-03T07:06:07", // Wednesday
      "0321-03-06T14:12:14", // Sunday
      "1776-04-09T21:18:21", // Tuesday
      "1900-05-12T04:24:28", // Saturday
      "1901-06-15T11:30:35", // Saturday
      "1970-07-18T18:36:42", // Saturday
      "2000-08-21T01:42:49", // Monday
      "2008-09-24T08:48:56", // Wednesday
      "2016-10-27T15:54:03", // Thursday
      "2111-11-30T22:01:10", // Monday
      "9999-12-31T12:07:17", // Friday
      864e13, // max date (Sat 13 Sep 275760 00:00:00)
      -864e13, // min date (Tue 20 Apr -271821 00:00:00)
      -623e11 // single-digit negative year (Tue 17 Oct -5 04:26:40)
  ].map(function (x) {
      return DateTime(new Date(x));
  });

  var expectedValues = {
       year: [1, 21, 321, 1776, 1900, 1901, 1970, 2000, 2008, 2016, 2111, 9999, 275760, -271821, -5],
       monthName: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "September", "April", "October"],
       month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 9, 4, 10],
       day: ["Monday", "Wednesday", "Sunday", "Tuesday", "Saturday", "Saturday", "Saturday", "Monday", "Wednesday", "Thursday", "Monday", "Friday", "Saturday", "Tuesday", "Tuesday"],
       date: [1, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 31, 13, 20, 17],
       ordinalDate: ["1st", "3rd", "6th", "9th", "12th", "15th", "18th", "21st", "24th", "27th", "30th", "31st", "13th", "20th", "17th"],
       hours: [0, 7, 14, 21, 4, 11, 18, 1, 8, 15, 22, 12, 0, 0, 4],
       hours12: [12, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 12, 12, 12, 4],
       minutes: [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 1, 7, 0, 0, 26],
       seconds: [0, 7, 14, 21, 28, 35, 42, 49, 56, 3, 10, 17, 0, 0, 40],
       ampm: ["am", "am", "pm", "pm", "am", "am", "pm", "am", "am", "pm", "pm", "pm", "am", "am", "am"],
       offset: [-62135596800000, -61501568033000, -52031843266000, -6113414499000, -2197654532000, -2163155365000, 17174202000, 966822169000, 1222246136000, 1477583643000, 4478364070000, 253402258037000, 8640000000000000, -8640000000000000, -62300000000000]
   };

   describe("getter", function() {
     Object.keys(expectedValues).forEach(function(propertyName) {
       it("returns expected values for property'" + propertyName + "'", function() {
         testDates.forEach(function(testDate, i) {
           expect(testDate[propertyName]).toEqual(expectedValues[propertyName][i]);
         });
       });
     });
   });

   describe("setter", function() {
     var settableProperties = [["seconds", "minutes", "hours", "date", "month", "year"],
        ["seconds", "minutes", "hours12", "ampm", "ordinalDate", "monthName", "year"],
        ["offset"]];
     it("can reconstruct a date using the property setters", function() {
       testDates.forEach(function(date, i) {
         settableProperties.forEach(function(properties) {
           var date = DateTime(new Date(0));
           properties.forEach(function(property) {
             date[property] = expectedValues[property][i];
           });
           expect(date.offset).toEqual(expectedValues.offset[i]);
         });
       });
     });

     it("throws an error on attempt to write to property 'day'", function() {
       expect(function() {
         var date = DateTime();
         date.day = 4;
       }).toThrow();
     });
   });

   var expectedStrings = {
          "YYYY-M-D H:m:s": ["1-1-1 0:00:00", "21-2-3 7:06:07", "321-3-6 14:12:14", "1776-4-9 21:18:21", "1900-5-12 4:24:28", "1901-6-15 11:30:35", "1970-7-18 18:36:42", "2000-8-21 1:42:49", "2008-9-24 8:48:56", "2016-10-27 15:54:03", "2111-11-30 22:01:10", "9999-12-31 12:07:17", "275760-9-13 0:00:00", "-271821-4-20 0:00:00", "-5-10-17 4:26:40"],
          "dddd, MMMM Do YYYY h:m:s a": ["Monday, January 1st 1 12:00:00 am", "Wednesday, February 3rd 21 7:06:07 am", "Sunday, March 6th 321 2:12:14 pm", "Tuesday, April 9th 1776 9:18:21 pm", "Saturday, May 12th 1900 4:24:28 am", "Saturday, June 15th 1901 11:30:35 am", "Saturday, July 18th 1970 6:36:42 pm", "Monday, August 21st 2000 1:42:49 am", "Wednesday, September 24th 2008 8:48:56 am", "Thursday, October 27th 2016 3:54:03 pm", "Monday, November 30th 2111 10:01:10 pm", "Friday, December 31st 9999 12:07:17 pm", "Saturday, September 13th 275760 12:00:00 am", "Tuesday, April 20th -271821 12:00:00 am", "Tuesday, October 17th -5 4:26:40 am"],
          "YYYY.MMMM.M.dddd.D.Do.H.h.m.s.a": ["1.January.1.Monday.1.1st.0.12.00.00.am", "21.February.2.Wednesday.3.3rd.7.7.06.07.am", "321.March.3.Sunday.6.6th.14.2.12.14.pm", "1776.April.4.Tuesday.9.9th.21.9.18.21.pm", "1900.May.5.Saturday.12.12th.4.4.24.28.am", "1901.June.6.Saturday.15.15th.11.11.30.35.am", "1970.July.7.Saturday.18.18th.18.6.36.42.pm", "2000.August.8.Monday.21.21st.1.1.42.49.am", "2008.September.9.Wednesday.24.24th.8.8.48.56.am", "2016.October.10.Thursday.27.27th.15.3.54.03.pm", "2111.November.11.Monday.30.30th.22.10.01.10.pm", "9999.December.12.Friday.31.31st.12.12.07.17.pm", "275760.September.9.Saturday.13.13th.0.12.00.00.am", "-271821.April.4.Tuesday.20.20th.0.12.00.00.am", "-5.October.10.Tuesday.17.17th.4.4.26.40.am"]
      };

    describe("toString", function() {
      it("returns expected values", function() {
        testDates.forEach(function(date, i) {
          for(format in expectedStrings) {
            expect(date.toString(format)).toEqual(expectedStrings[format][i]);
          }
        });
      });
    });

    it("parses a string as a date when passed in a string and a format string", function () {
      for (format in expectedStrings) {
          expectedStrings[format].forEach(function (date, i) {
              expect(DateTime(date, format).offset).toEqual(testDates[i].offset);
          });
      }
  });
});
