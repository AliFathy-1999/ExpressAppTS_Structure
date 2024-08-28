
import fs from 'fs';
import { infoLogger } from './logger';

const createFolderIfNotExists = (foldersPath: Array<string>) => {
    if(foldersPath.length !=0 ){    
        foldersPath?.forEach((folderPath) => {
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                infoLogger(`Folder created: ${folderPath}`)
            } else {
                infoLogger(`Folder already exists: ${folderPath}`);
            }
    });
    }
};

export {
    createFolderIfNotExists
}