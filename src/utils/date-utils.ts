import moment from 'moment';
import { splitCharacterType } from '../interfaces/utils.interface';

const formatDate = (unFormateDate:string,splitCharacter: splitCharacterType = "/") => {
    //formatDate("20220202")
    //splitCharacter =>  / or - or . or space
    const date = unFormateDate ? moment(unFormateDate, 'YYYYMMDD').format(`YYYY${splitCharacter}MM${splitCharacter}DD`) : "-";
    return date
};

const formatDateLocale = (date:Date, locale:string= 'en-US') => new Intl.DateTimeFormat(locale).format(date);

export {
    formatDate,
    formatDateLocale
}