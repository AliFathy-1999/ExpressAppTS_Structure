// type messageType = string | ((field: string) => string);

// // type IPatternKeys = {
// //     pattern : RegExp,
// //     message : messageType
// // }
type messageTypeFunction = ((field: string) => string)

interface PatternKeys {
    pattern: RegExp;
    message: string | messageTypeFunction;
}
type IPattern = Record<string, PatternKeys>;

export  default IPattern ;
// type PatternType = {
//     pattern: RegExp;
//     message: string | ((field: string) => string);
// };

// type IPattern = Record<string, PatternType>;

// export default  IPattern;