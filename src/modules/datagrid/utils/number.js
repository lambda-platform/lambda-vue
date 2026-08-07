import numeral from 'numeral';

export function getMoney(number) {
    let value = numeral(number);

    return value.format('0,0.00');

}

export function getNumber(number) {
    let value = numeral(number);

    return value.format('0,0');

}
export function aggregationNumber(number) {
    let value = numeral(number);
    let raw = value.value();

    if (raw === null || isNaN(raw)) {
        return value.format('0,0');
    }

    // 2 орноор бөөрөнхийлсний дараа бутархай үлдээгүй бол бүхэл хэлбэрээр
    return Math.round(raw * 100) % 100 === 0
        ? value.format('0,0')
        : value.format('0,0.00');

}
export function number(number) {
    let value = numeral(number);

    return value.format('0,0.00');

}
export function formatedNumber(number) {
    let value = numeral(number);

    return numeral(value.format('0,0.00')).value();

}
export function gridNumber(row, column) {
    let value = numeral(row[column.property]);

    return value.format('0,0.00');

}
export function cellNumber(row, column, number) {
    let value = numeral(number);

    return value.format('0,0');

}
export function getNumbervalue(number) {
    let value = numeral(number);

    return value.value();

}
