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
});
