require('dotenv').config();
const app = require('./app.ts');
const { PORT } = require('./config/index.ts');
const port = PORT || 4000;

app.listen(port, () => {
  console.log(`Server Running here 👉 http://localhost:${port}`);
});
