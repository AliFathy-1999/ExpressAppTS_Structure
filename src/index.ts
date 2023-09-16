import app from './app';
import config from './config/index'
const { port } = config.app


app.listen( port  || 4000, () => {
  console.log(`Server Running here 👉 http://localhost:${port}`);
});
