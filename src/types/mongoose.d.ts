declare module 'mongoose' {
    interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
        cache(): Query<ResultType, DocType, THelpers, RawDocType>;
    }
}
