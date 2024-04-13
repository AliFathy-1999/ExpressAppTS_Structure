import path from "path";
import ejs from 'ejs';
const renderTemplate = async (content: {[key: string]: any} ,templateName: string) => {
    try {
        const templatePath = path.join(__dirname, `../templates/${templateName}.ejs`);
        const renderTemp = await ejs.renderFile(templatePath, {
            user_firstname: content.firstName,
            status: content.status,
            confirm_link: `${process.env.DEV_URL}/api/v1/auth/activate/token=${content.token}`,
            operation: "Activation your account" 
        });
        return renderTemp;
    } catch (error) {
        throw new Error(error);
    }
}

export default renderTemplate;