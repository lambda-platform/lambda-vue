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

export function isUTC(dateString) {
    return dateString.endsWith('Z');
}
export function isTimestamp(timestampStr) {

    const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{9}[+-]\d{2}:\d{2}$/;
    return timestampRegex.test(timestampStr);
}
export function getUTCValue(dataString) {
    if(dataString) {

        if(isUTC(dataString)){
            return dataString;
        } else {
            const date = new Date(dataString);
            return date.getFullYear() +
                '-' + pad(date.getMonth() + 1, 2) +
                '-' + pad(date.getDate(), 2) +
                'T' + pad(date.getHours(), 2) +
                ':' + pad(date.getMinutes(), 2) +
                ':' + pad(date.getSeconds(), 2) +
                '.' + pad(date.getMilliseconds(), 3).substring(0, 3) +
                'Z';
        }


    } else {
        return null;
    }
}

export function hasZeroTime(timestamp) {
    const pattern = /T00:00:00Z$/;
    return pattern.test(timestamp);
}

export function formatDateOrDateTime(dataString){
   if(hasZeroTime(dataString)){
       return formatDate(dataString)
   } else {
       return formatDateTime(dataString)
   }
}
export function formatDate(dataString) {
    if(dataString){
        if(isUTC(dataString)) {
            const date = new Date(dataString);
            const YYYY = date.getUTCFullYear();
            const MM = String(date.getUTCMonth() + 1).padStart(2, '0');
            const DD = String(date.getUTCDate()).padStart(2, '0');
            return `${YYYY}-${MM}-${DD}`;
        } else {
            const date = new Date(dataString);
            const YYYY = date.getFullYear();
            const MM = String(date.getMonth() + 1).padStart(2, '0');
            const DD = String(date.getDate()).padStart(2, '0');
            return `${YYYY}-${MM}-${DD}`;
        }


    } else {
        return  null
    }

}
export function formatDateTime(dataString) {
    if(dataString){

        if(isUTC(dataString)) {
            const date = new Date(dataString);
            const YYYY = date.getUTCFullYear();
            const MM = String(date.getUTCMonth() + 1).padStart(2, '0');
            const DD = String(date.getUTCDate()).padStart(2, '0');
            const HH = String(date.getUTCHours()).padStart(2, '0');
            const mm = String(date.getUTCMinutes()).padStart(2, '0');
            const ss = String(date.getUTCSeconds()).padStart(2, '0');

            return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;
        } else {
            const date = new Date(dataString);
            const YYYY = date.getFullYear();
            const MM = String(date.getMonth() + 1).padStart(2, '0');
            const DD = String(date.getDate()).padStart(2, '0');
            const HH = String(date.getHours()).padStart(2, '0');
            const mm = String(date.getMinutes()).padStart(2, '0');
            const ss = String(date.getSeconds()).padStart(2, '0');

            return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;
        }
    } else {
        return  null
    }

}
