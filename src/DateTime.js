"use_strict";

var DateTime = (function() {
  function createDateTime(date) {
    return {
      get offset() {
        return date.getTime();
      }
    };
  }
  return function() {
    return createDateTime(new Date());
  };
})();
