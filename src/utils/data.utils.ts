
import { parse, stringify } from 'circular-json';

const orderObject = <T>(unOrderedObject: { [key:string]: any }, keyOrder: Array<string>): T => {
    const orderedObj: { [key: string]: any } = {};
    keyOrder.forEach(key => {
    if (unOrderedObject.hasOwnProperty(key)) {
        orderedObj[key] = unOrderedObject[key];
    }
    });
    return orderedObj as T;
}

const removeFalsyValues = <T>(obj: { [key:string] : any }) => {
    const result = {};
    for (const key in obj) {
            if ( obj[key] && !(typeof obj[key] == "object" && Object.keys(obj[key]).length == 0)) {
                result[key] = obj[key];
        }
    }
        
    return result as T;
}

const removeSensitiveData = (data: any, sensitiveKeys: string[]): any => {
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    const flatData = parse(stringify(data));


    if (Array.isArray(data)) {
        return data.map(item => removeSensitiveData(item, sensitiveKeys));
    }

    const sanitizedData: any = {};
    for (const key in flatData) {
        if (typeof key == "string" && sensitiveKeys.includes(key)  ) {
            sanitizedData[key] = '[REDACTED]';
        } 
        else {
            sanitizedData[key] = removeSensitiveData(flatData[key], sensitiveKeys);
        }
    }

    return sanitizedData;
};

export {
    orderObject,
    removeFalsyValues,
    removeSensitiveData
}