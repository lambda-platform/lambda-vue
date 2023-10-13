var templateRe = /\{ *([\w_-]+) *\}/g;
import {isUTC, isTimestamp, formatDate,} from "./date"
export function template(str, data) {
    return str.replace(templateRe, function (str, key) {
        var value = data[key];

        if (value === undefined) {
            value = "-------";
        } else if (typeof value === 'function') {
            value = value(data);
        } else {
            if(isUTC(value) || isTimestamp(value)) {
                return  formatDate(value)
            }
        }
        return value;
    });
}
