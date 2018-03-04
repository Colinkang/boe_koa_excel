class ExtendableError extends Error {
    constructor(message = '') {
      super(message);
  
      // extending Error is weird and does not propagate `message`
      Object.defineProperty(this, 'message', {
        enumerable: false,
        value: message,
        writable: true
      });
  
      Object.defineProperty(this, 'name', {
        enumerable: false,
        value: this.constructor.name
      });
  
      if (Error.hasOwnProperty('captureStackTrace')) {
        Error.captureStackTrace(this, this.constructor);
        return;
      }
  
      Object.defineProperty(this, 'stack', {
        enumerable: false,
        value: (new Error(message)).stack
      });
    }
  }
  
  class ErrorNotFound extends ExtendableError {
    constructor(m) {
      super(m);
    }
  }
  
  class ErrorInvalidPwd extends ExtendableError {
    constructor(m) {
      super(m);
    }
  }
  
  class ErrorParamRequired extends ExtendableError {
    constructor(m) {
      super(m);
    }
  }
  
  class ErrorReachLimit extends ExtendableError {
    constructor(m) {
      super(m);
    }
  }
  
  class SqlError extends ExtendableError {
    constructor(m) {
      super(m);
    }
  }
  
  class ErrorUnknownType extends ExtendableError {
    constructor(m) {
      super(m);
    }
  }
  
  class ErrorInvalidStatus extends ExtendableError {
    constructor(m) {
      super(m);
    }
  }
  
  class ErrorNoPermission extends ExtendableError {
    constructor(m) {
      super(m);
    }
  }
  
  class ErrorAlreadyExist extends ExtendableError {
    constructor(m) {
      super(m);
    }
  }
  
  class KnownErrors {
    static get ErrorNotFound() {
      return ErrorNotFound;
    }
    static get ErrorInvalidPwd() {
      return ErrorInvalidPwd;
    }
    static get ErrorParamRequired() {
      return ErrorParamRequired;
    }
    static get ErrorReachLimit() {
      return ErrorReachLimit;
    }
    static get SqlError() {
      return SqlError;
    }
    static get ErrorUnknownType() {
      return ErrorUnknownType;
    }
    static get ErrorInvalidStatus() {
      return ErrorInvalidStatus;
    }
    static get ErrorNoPermission() {
      return ErrorNoPermission;
    }
    static get ErrorAlreadyExist() {
      return ErrorAlreadyExist;
    }
    static get ErrorContentLength() {
      return ErrorAlreadyExist;
    }
  }
  module.exports = KnownErrors;
  