export default class formatHelper {
  static numberSeperator(number) {
    if (typeof number === "string") {
      return number?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
  static toPersianString(str) {
    if (typeof str === "string") {
      return str
        .replace(/1/g, "۱")
        .replace(/2/g, "۲")
        .replace(/3/g, "۳")
        .replace(/4/g, "۴")
        .replace(/5/g, "۵")
        .replace(/6/g, "۶")
        .replace(/7/g, "۷")
        .replace(/8/g, "۸")
        .replace(/9/g, "۹")
        .replace(/0/g, "۰");
    } else {
      return str
        .toString()
        .replace(/1/g, "۱")
        .toString()
        .replace(/2/g, "۲")
        .toString()
        .replace(/3/g, "۳")
        .toString()
        .replace(/4/g, "۴")
        .toString()
        .replace(/5/g, "۵")
        .toString()
        .replace(/6/g, "۶")
        .toString()
        .replace(/7/g, "۷")
        .toString()
        .replace(/8/g, "۸")
        .toString()
        .replace(/9/g, "۹")
        .toString()
        .replace(/0/g, "۰");
    }
  }
  static toEnglishString(str) {
    if (typeof str === "string") {
      return str
        .replace(/۱/g, "1")
        .replace(/۲/g, "2")
        .replace(/۳/g, "3")
        .replace(/۴/g, "4")
        .replace(/۵/g, "5")
        .replace(/۶/g, "6")
        .replace(/۷/g, "7")
        .replace(/۸/g, "8")
        .replace(/۹/g, "9")
        .replace(/۰/g, "0");
    } else {
      return str
        .toString()
        .replace(/۱/g, "1")
        .toString()
        .replace(/۲/g, "2")
        .toString()
        .replace(/۳/g, "3")
        .toString()
        .replace(/۴/g, "4")
        .toString()
        .replace(/۵/g, "5")
        .toString()
        .replace(/۶/g, "6")
        .toString()
        .replace(/۷/g, "7")
        .toString()
        .replace(/۸/g, "8")
        .toString()
        .replace(/۹/g, "9")
        .toString()
        .replace(/۰/g, "0");
    }
  }
  static daysName(str) {
    if (typeof str === "string") {
      return str
        .replace(/0/g, "یکشنبه")
        .replace(/1/g, "دوشنبه")
        .replace(/2/g, "سه شنبه")
        .replace(/3/g, "چهارشنبه")
        .replace(/4/g, "پنجشنبه")
        .replace(/5/g, "جمعه")
        .replace(/6/g, "شنبه");
    } else {
      return str
        .toString()
        .replace(/0/g, "یکشنبه")
        .toString()
        .replace(/1/g, "دوشنبه")
        .toString()
        .replace(/2/g, "سه شنبه")
        .toString()
        .replace(/3/g, "چهارشنبه")
        .toString()
        .replace(/4/g, "پنجشنبه")
        .toString()
        .replace(/5/g, "جمعه")
        .toString()
        .replace(/6/g, "شنبه");
    }
  }
  static monthName(str) {
    const monthNames = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];

    if (str) {
      return monthNames[str - 1];
    }
  }
  static cutString(str, from, to) {
    if (str?.length > to) {
      return `${str.substring(from, to)}...`;
    } else {
      return str;
    }
  }
}
