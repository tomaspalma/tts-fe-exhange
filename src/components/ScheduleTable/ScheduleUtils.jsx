
/**
 *
 * @param {String} hour Hour string in the format "hh:mm". Attention, the fields of minutes can only be "30" or "00".
 * Case the minute field doesn't obey the contraint cited above, an error will be displayed in the command line.
 * @returns The index of the hour case valid. -1 otherwise.
 */
const hourToIndex = (hour, firstHour) => {
    let splitedHour = hour.split(":");
    let hourField = splitedHour[0],
        minuteField = splitedHour[1];

    if (minuteField === "00" || minuteField === "30") {
        let isHalfHour = minuteField == "30" ? 1 : 0;
        return (parseInt(hourField) - firstHour) * 2 + isHalfHour;
    }

    console.error(`Minutes field not in the correct format: ${minuteField}`);
    return -1;
};

/**
 * 
 * @param {Integer} index 
 * @returns 
 */
const indexToHour = (index, firstHour) => {
    let hour = Math.floor(index / 2 + firstHour)
        .toString()
        .padStart(2, "0");
    let minutes = index % 2 === 0 ? "00" : "30";
    return hour + ":" + minutes;
}; 

/**
 * The formated hour given the index in the column.
 * Case it is half an hour it will return nothing, since it should be printed in the table.
 * @param {Integer} index
 * @returns The formated hour.
 */
const getHourInTable = (row, firstHour) => {
    if (row % 2 === 0) return <b>{indexToHour(row, firstHour)}</b>;
};

export default {hourToIndex, indexToHour, getHourInTable};