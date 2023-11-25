import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import format from "date-fns-tz/format";


function date() {
    const now = new Date();

    const targetTimeZone = 'Asia/Manila';
    
    // Convert the current UTC date to the target time zone
    const zonedDate = utcToZonedTime(now, targetTimeZone);
    
    // Format the zoned date
    const formattedDate = format(zonedDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: targetTimeZone });
    
    return formattedDate;
    
}
export default date();