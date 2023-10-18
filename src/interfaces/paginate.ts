interface Ipaginate {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
    data: any[]; 
}

export default Ipaginate;