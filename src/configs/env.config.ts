// MODULES
import Env from "@harrypoggers25/env";

const env = Env.define({
    TOKEN_SECRET: { type: 'string' },
    DB_HOST: { type: 'string', default: 'localhost' },
    DB_USER: { type: 'string' },
    DB_PASSWORD: { type: 'string' },
    DB_NAME: { type: 'string' },
    DB_PORT: { type: 'number', default: 5432 },
    MQTT_PORT: { type: 'number', default: 1883 },
}, { init: true });

export default env;
