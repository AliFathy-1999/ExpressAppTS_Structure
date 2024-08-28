import { splitCharacterType } from "../interfaces/utils.interface";

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

export {
    trimText,
    InsertSplitCharInMiddle,
    concatenateText,
    replaceEngDigitsToArDigits
}