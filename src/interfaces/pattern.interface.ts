type messageTypeFunction = ((field: string) => string)

interface PatternKeys {
    pattern: RegExp;
    message: string | messageTypeFunction;
}
type IPattern = Record<string, PatternKeys>;

export  default IPattern ;
