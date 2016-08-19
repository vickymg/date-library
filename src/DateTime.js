"use_strict";

var DateTime = (function() {
  function createDateTime(date) {
    return {
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
