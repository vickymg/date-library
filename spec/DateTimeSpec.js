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
});
