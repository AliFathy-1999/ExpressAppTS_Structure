import { Application } from "express";
import config from './index'
const { port } = config.app;

const startExpressApp = (app :Application) =>{
    app.listen( port  || 4000, () => {
        console.log(`Server Running here 👉 http://localhost:${port}`);
    });
}

export default startExpressApp;