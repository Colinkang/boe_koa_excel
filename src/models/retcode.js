class RETCODE {
    static get OK() {
      return '1001';
    }
    static get ERROR() {
      return '1002';
    }
    static get PARAM_ERROR() {
      return '1003';
    }
    static get NEED_LOGIN() {
      return '1004';
    }
    static get NOT_FOUND() {
      return '1005';
    }
    static get INVALID_STATUS() {
      return '1006';
    }
    static get PARAM_REQUIRED() {
      return '1007';
    }
    static get INVALID_PWD() {
      return '1008';
    }
    static get NO_PERMISSION() {
      return '1009';
    }
    static get ALREADY_EXIST() {
      return '1010';
    }
    static get NEED_REGITER() {
      return '1011';
    }
    static get NOT_READ() {
      return '1012';
    }
    static get NOT_GET_PRESENT() {
      return '1013';
    }
    static get GET_PRESENT() {
      return '1014';
    }
    static get ADD_INTEREST() {
      return '1015';
    }
  }
  
  module.exports = RETCODE;
  