import { splitCharacterType } from "../interfaces/utils.interface";
import * as cheerio from 'cheerio';

const trimText = (text:string) => {
    return text.replace(/\s+/g, ' ');
}

const  InsertSplitCharInMiddle = (str:string, splitCharacter:splitCharacterType = "-") => {
    if(str.includes(splitCharacter)) return str;
    const length = str.length;
    const middleIndex = Math.floor(length / 2);
    // Insert special character in the middle
    const firstHalf = str.substring(0, middleIndex);
    const secondHalf = str.substring(middleIndex);
    
    return `${firstHalf}${splitCharacter}${secondHalf}`;
}

const replaceEngDigitsToArDigits = (str:string | number) => str.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

const concatenateText = (groupOfText:Array<string>,splitedCharacter:splitCharacterType = " "): string => groupOfText.map(text => text.trim()).join(splitedCharacter);

const extractDataFromHTML = (htmlBody:string, extractBy:string) => {
    const $ = cheerio.load(htmlBody);
    const bodyText = $('body').text(); //Extract text from html body
    const match = bodyText.match(extractBy);
    return match ? match[1] : null;
}

export {
    trimText,
    InsertSplitCharInMiddle,
    concatenateText,
    replaceEngDigitsToArDigits,
    extractDataFromHTML
}