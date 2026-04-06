// MODULES
import Db, { DataTypes } from '@harrypoggers25/db-postgresql';
import env from './env.config.js';

export const db = Db.config({
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    port: env.DB_PORT
});

export const User = db.define('users', {
    user_id: { type: DataTypes.SERIAL, allowNull: false, primaryKey: true },
    user_name: { type: DataTypes.VARCHAR(255), allowNull: true },
    user_email: { type: DataTypes.VARCHAR(255), allowNull: false }
});

export const UserPassword = db.define('user_passwords', {
    user_password: { type: DataTypes.TEXT, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true }
});
UserPassword.setForeignKey(User, 'user_id');

export const Device = db.define('devices', {
    device_id: { type: DataTypes.SERIAL, allowNull: false, primaryKey: true },
    device_name: { type: DataTypes.VARCHAR(255), allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false }
});
Device.setForeignKey(User, 'user_id');

export const DeviceToken = db.define('device_tokens', {
    device_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    device_token: { type: DataTypes.TEXT, allowNull: false },
});
DeviceToken.setForeignKey(Device, 'device_id');

