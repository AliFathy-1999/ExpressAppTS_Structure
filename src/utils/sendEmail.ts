
import SGmail, { MailDataRequired } from '@sendgrid/mail'
import { config } from "dotenv";
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
        await SGmail.send(msg);
    } catch (error) {
        throw new Error('Failed to send email');
    }
}

export default sendEmail;