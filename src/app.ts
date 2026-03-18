// MODULES
import Aedes from 'aedes'
import ch from '@harrypoggers25/color-utils';
import jwt from 'jsonwebtoken';
import { createServer } from 'node:net'

// CONFIGS
import env from './configs/env.config.js';
import { Device, DeviceToken, db } from './configs/db.config.js';

await db.sync({ alter: false });
const server = createServer(Aedes.createBroker({
    authenticate: async (_, username, password, done) => {
        try {
            const device_name = username?.trim();
            if (!device_name?.trim()) throw new Error('Authentication failed. Device name is required');

            const device_token = password?.toString().trim();
            if (!device_token) throw new Error('Authentication failed. Device token is required');

            const devices = await Device.find({ where: { device_name } });
            if (!devices) throw new Error(`Authentication failed. Failed to fetch device with device name '${device_name}'`);
            if (!devices.length) throw new Error(`Authentication failed. Device '${device_name}' was not found`);

            const { device_id } = devices[0];
            const deviceToken = await DeviceToken.find({ where: { device_id } });
            if (!deviceToken) throw new Error(`Authentication failed. Failed to fetch device token for device '${device_name}'`);
            if (!deviceToken.length) throw new Error(`Authentication failed. Device token for device '${device_name} was not found'`);

            if (deviceToken[0].device_token !== device_token) throw new Error(`Authentication failed. Device token invalid`);

            const decodedToken = jwt.verify(device_token, env.TOKEN_SECRET) as any;
            if (decodedToken.device_id !== device_id) throw new Error(`Authentication failed. Device token does not match device credentials`);

            done(null, true);
        } catch (error: any) {
            console.log(ch.red('MQTT BROKER AUTH ERROR:'), error.message);
            error.returnCode = 4;
            done(error, false)
        }
    }
}).handle);

server.listen(env.MQTT_PORT, () => {
    console.log(ch.cyan('MQTT Broker'), 'started and listening on port ', env.MQTT_PORT);
});
