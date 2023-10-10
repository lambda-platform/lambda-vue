import Moment from 'moment'

export function getDate(date) {
    if (typeof date === 'string' || date instanceof String) {
        return date;
    } else {
        if ((new Date(date)).toString() !== "Invalid Date") {
            return Moment(date).format("YYYY-MM-DD");
        } else {
            return Moment(date * 1).format("YYYY-MM-DD");
        }
    }
}

export function toMoment(date) {
    return Moment(date)
}

export function toTime(time) {

    return Moment(time, 'HH:mm:ss')

}

export function toDateTime(datetime) {
    return Moment(datetime, 'YYYY-MM-DD HH:mm:ss')
}

export function now() {
    return Moment().format("YYYY-MM-DD HH:mm:ss")
}

export function getDateTime(date) {
    if (typeof date === 'string' || date instanceof String) {
        return date;
    } else {
        if ((new Date(date)).toString() !== "Invalid Date") {
            return Moment(date).format("YYYY-MM-DD HH:mm");
        } else {
            return Moment(date * 1).format("YYYY-MM-DD HH:mm");
        }
    }
}

export function getTime(date) {
    if (typeof date === 'string' || date instanceof String) {
        return date;
    } else {
        if ((new Date(date)).toString() !== "Invalid Date") {
            return Moment(date).format("HH:mm:ss");
        } else {
            return Moment(date * 1).format("HH:mm:ss");
        }
    }

}
function pad(number, length) {
    let str = String(number);
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}
export function formatToCustomISOString(dateTimeStr) {
    if(dateTimeStr) {

        const date = new Date(dateTimeStr);


        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1, 2) +
            '-' + pad(date.getDate(), 2) +
            'T' + pad(date.getHours(), 2) +
            ':' + pad(date.getMinutes(), 2) +
            ':' + pad(date.getSeconds(), 2) +
            '.' + pad(date.getMilliseconds(), 3).substring(0, 3) +
            'Z';
    } else {
        return null;
    }
}
