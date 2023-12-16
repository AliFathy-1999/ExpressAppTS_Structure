
import SGmail, { MailDataRequired } from '@sendgrid/mail'
import { config } from "dotenv";
config();
const { SENDER_EMAIL, SENDGRID_API_KEY } = process.env;
SGmail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (emailBody: MailDataRequired) => {
    try {
        SGmail.send({
            from: SENDER_EMAIL,
            ...emailBody
        });
    } catch (error) {
        
    }
}

export default sendEmail;