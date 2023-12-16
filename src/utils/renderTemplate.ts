import path from "path";
import ejs from 'ejs';
const renderTemplate = async (content: {[key: string]: any} ,templateName: string) => {
    try {
        const templatePath = path.join(__dirname, `../templates/${templateName}.ejs`);
        const renderTemp = await ejs.renderFile(templatePath, {
            user_firstname: content.firstName,
            status: content.status,
            confirm_link: `http://localhost:4000/api/v1/auth/activate?email=${content.email}`,
            operation: "Activation your account" 
        });
        return renderTemp;
    } catch (error) {
        throw new Error(error);
    }
}

export default renderTemplate;