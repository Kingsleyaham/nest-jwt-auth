import appConfig from './app.config';
import dbConfig from './db.config';
import jwtConfig from './jwt.config';

export default (): Record<string, any> => ({ dbConfig, appConfig, jwtConfig });
