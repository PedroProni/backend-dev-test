import { app } from '@infrastructure/configuration/core/app.config';
import { Config } from '@infrastructure/configuration/env/dotenv.config';

const config = Config.getInstance();
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
