import { FridaManager } from './FridaManager';
import { AdbManager } from './AdbManager';
import { Device } from './Device';
import * as r from 'rethinkdb';
import { getDbConnection } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { generateHashForDevice } from '../utils/hash';


export class DeviceManager {
    fridaManager: FridaManager = new FridaManager();
    adbManager: AdbManager = new AdbManager();

    async initialize() {
        await this.fridaManager.initialize();
        await this.adbManager.initialize();
    }

    async getDevices(): Promise<Device[]> {
        const fridaDevices = this.fridaManager.devices;
        const adbDevices = await this.adbManager.getDevices();
        const devices = [...adbDevices, ...fridaDevices];
    
        const connection = await getDbConnection();
        if (connection) {
            for (const device of devices) {
                const deviceWithHashAsId = { ...device, id: device.hash };
                const result = await r.table('devices').insert(deviceWithHashAsId, { conflict: "update" }).run(connection);
                console.log(`Inserted/updated device ${device.id} in the database: ${JSON.stringify(result)}`);
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

    private deviceIdsToUuids: Map<string, string> = new Map();

}