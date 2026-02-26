// MODULES
import Aedes from 'aedes'
import ch from '@harrypoggers25/color-utils';
import jwt from 'jsonwebtoken';
import { createServer } from 'node:net'

// CONFIGS
import env from './configs/env.config.js';
import { Client, ClientToken, db } from './configs/db.config.js';

await db.sync({ alter: false });
const server = createServer(Aedes.createBroker({
    authenticate: async (_, username, password, done) => {
        try {
            const client_name = username?.trim();
            if (!client_name?.trim()) throw new Error('Authentication failed. Client name is required');

            const client_token = password?.toString().trim();
            if (!client_token) throw new Error('Authentication failed. Client token is required');

            const clients = await Client.find({ where: { client_name } });
            if (!clients) throw new Error(`Authentication failed. Failed to fetch client with client name '${client_name}'`);
            if (!clients.length) throw new Error(`Authentication failed. Client '${client_name}' was not found`);

            const { client_id } = clients[0];
            const clientToken = await ClientToken.find({ where: { client_id } });
            if (!clientToken) throw new Error(`Authentication failed. Failed to fetch client token for client '${client_name}'`);
            if (!clientToken.length) throw new Error(`Authentication failed. Client token for client '${client_name} was not found'`);

            if (clientToken[0].client_token !== client_token) throw new Error(`Authentication failed. Client token invalid`);

            const decodedToken = jwt.verify(client_token, env.TOKEN_SECRET) as any;
            if (decodedToken.client_id !== client_id) throw new Error(`Authentication failed. Client token does not match client credentials`);

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
