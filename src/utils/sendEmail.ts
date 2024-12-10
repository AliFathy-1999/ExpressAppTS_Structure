
import SGmail, { MailDataRequired } from '@sendgrid/mail'
import { config } from "dotenv";
import { ApiError } from '../lib';
import { errorLogger, infoLogger } from './logger';
config();
const { SENDER_EMAIL, SENDGRID_API_KEY, WEBSITE_NAME } = process.env;
SGmail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (toEmail: string, subject: string, htmlContent: string) => {
    try {
        const msg: MailDataRequired = {
            to: toEmail,
            from: {email: SENDER_EMAIL, name: WEBSITE_NAME },
            subject: subject,
            html: htmlContent
        }
        const emailRequest = await SGmail.send(msg);
        if(emailRequest[0].statusCode === 202) infoLogger(`subject: ${subject}, mail sent successfully to this email ${toEmail}`)
    } catch (error) {
        errorLogger(`Failed to send email: ${JSON.stringify(error)}`, "Email")
        throw new ApiError("Failed to send email",error.code);
    }
}

export default sendEmail;