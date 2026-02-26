// MODULES
import ch from '@harrypoggers25/color-utils';
import jwt from 'jsonwebtoken';

// CONFIGS
import { Client, ClientToken, db } from '../configs/db.config.js';
import env from '../configs/env.config.js';

await db.sync({ alter: true });
await (async () => {
    const transaction = await db.transaction({ rollbackOnError: true });
    const client = await Client.create({ client_name: 'Client 1' }, { transaction });
    if (!client) {
        console.log(ch.red('DB SCRIPT ERROR:'), `Failed to create client 'Client 1'`);
        return;
    }

    const { client_id } = client;
    const client_token = jwt.sign(client, env.TOKEN_SECRET, { expiresIn: '1y' });
    const clientToken = await ClientToken.create({ client_id, client_token }, { transaction });
    if (!clientToken) {
        console.log(ch.red('DB SCRIPT ERROR:'), `Failed to create client token for client 'Client 1'`);
        return;
    };
    await transaction.commit();
    console.log(ch.green('JWT TOKEN GENERATED:'), clientToken.client_token);
    console.log();
})();

