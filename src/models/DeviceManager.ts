import { FridaManager } from './FridaManager';
import { AdbManager } from './AdbManager';
import { Device } from './Device';
import * as r from 'rethinkdb';
import { getDbConnection } from '../db';

export class DeviceManager {
    static FRIDA_SERVER_DIR = "/data/local/tmp"
    fridaManager: FridaManager = new FridaManager();
    adbManager: AdbManager = new AdbManager();

    async initialize() {
        // await this.fridaManager.initialize();
        await this.adbManager.initialize();
    }

    async getDevices(): Promise<Device[]> {
        const adbDevices = await this.adbManager.getDevices();
        const devices = [...adbDevices];

        const connection = await getDbConnection();
        if (connection) {
            for (const device of devices) {
                const deviceWithHashAsId = { ...device, id: device.hash };
                const result = await r.table('devices').insert(deviceWithHashAsId, { conflict: "update" }).run(connection);
                //   console.log(`Inserted/updated device ${device.id} in the database: ${JSON.stringify(result)}`);
            }
        }
        return devices;
    }


    async getDeviceById(id: string): Promise<Device | null> {
        const connection = await getDbConnection();
        if (connection) {
            const device = await r.table('devices').get(id).run(connection);
            return device as Device || null;
        }
        return null;
    }

    async getFridaVersion(deviceId: string): Promise<{ installed: boolean, version?: string, architecture?: string, location?: string }> {
        return this.adbManager.getFridaServerInfo(deviceId);
    }

    async installLatestFrida(deviceId: string): Promise<{ installed?: boolean, location?: string }> {
        return this.adbManager.installFridaServer(deviceId);
    }
}