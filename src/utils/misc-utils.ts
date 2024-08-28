import * as QRCode from 'qrcode';
import { CustomResponse } from '../interfaces/utils.interface';

const generateQRCode = async (qrCodeContent:any) => {
    try {
        const qrCodeAsString = JSON.stringify(qrCodeContent)
        const generateUrl = await QRCode.toDataURL(qrCodeAsString);
        return generateUrl;
    } catch (err) {
        console.error(err)
    }
}
const handleStringifyValueResponse = (stringValue:string) => {
    //Example
    // stringValue = "{\people\:{\persons\:[{\id\\:\"123\",\name\:\"علي احمد \",\age\:\"22\",\salary\:\"500\"},{\id\:\"456\",\name\:\"حسام\",\age\:\"30\",\salary\:\"1000\"}]}}"
    const parseString = JSON.parse(stringValue)
    return parseString;
}
const setSuccessFlag = (res: CustomResponse, body: any) => {
    res.success = res.statusCode >= 200 && res.statusCode < 300;
    body.success = res.success;
    return body;
};

export {
    generateQRCode,
    handleStringifyValueResponse,
    setSuccessFlag,
}