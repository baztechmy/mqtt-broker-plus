// MODULES
import ch from '@harrypoggers25/color-utils';
import jwt from 'jsonwebtoken';

// CONFIGS
import { User, Device, DeviceToken, db } from '../configs/db.config.js';
import env from '../configs/env.config.js';

// LOCAL FUNCTIONS
function insertDevices(user_id: number, amount: number) {
    const entry: Array<Partial<ReturnType<typeof Device.getEmptyModel>>> = [];
    for (let i = 1; i <= amount; i++) {
        entry.push({ device_name: `device${user_id}.${i}`, user_id });
    }
    return entry;
}

await db.sync({ alter: true });
await (async () => {
    const transaction = await db.transaction({ rollbackOnError: true });
    for (let i = 1; i <= 3; i++) {
        const [user_id, user_name, user_email] = [i, `User${i}`, `user${i}@email.com`];
        const user = await User.create({ user_id, user_name, user_email }, { transaction });
        if (!user) {
            console.log(ch.red('DB SCRIPT ERROR:'), `Failed to create user '${user_name}'`);
            return;
        }
    }

    const devices = [
        ...insertDevices(1, 3),
        ...insertDevices(2, 2),
    ];
    for (const { device_name, user_id } of devices) {
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

        console.log(ch.green('JWT TOKEN GENERATED:'), deviceToken.device_token);
    }

    await transaction.commit();
    console.log(ch.green('TRANSACTION COMMITTED:'), 'Successfully committed all db transaction');
    console.log();
})();

