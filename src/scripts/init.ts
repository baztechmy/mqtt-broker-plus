// MODULES
import ch from '@harrypoggers25/color-utils';
import jwt from 'jsonwebtoken';

// CONFIGS
import { User, Device, DeviceToken, db } from '../configs/db.config.js';
import env from '../configs/env.config.js';

await db.sync({ alter: true });
await (async () => {
    const transaction = await db.transaction({ rollbackOnError: true });
    const [user_name, user_email] = ['Baztech', 'baztech@gmail.com'];
    const user = await User.create({ user_name, user_email }, { transaction });
    if (!user) {
        console.log(ch.red('DB SCRIPT ERROR:'), `Failed to create user '${user_name}'`);
        return;
    }

    const { user_id } = user;
    const device_name = 'device1';
    const device = await Device.create({ device_name, user_id }, { transaction });
    if (!device) {
        console.log(ch.red('DB SCRIPT ERROR:'), `Failed to create device '${device_name}'`);
        return;
    }

    const { device_id } = device;
    const device_token = jwt.sign(device, env.TOKEN_SECRET, { expiresIn: '1y' });
    const deviceToken = await DeviceToken.create({ device_id, device_token }, { transaction });
    if (!deviceToken) {
        console.log(ch.red('DB SCRIPT ERROR:'), `Failed to create device token for device '${device_name}'`);
        return;
    };
    await transaction.commit();
    console.log(ch.green('JWT TOKEN GENERATED:'), deviceToken.device_token);
    console.log();
})();

