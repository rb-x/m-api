import { Route, Get } from 'tsoa';
import { Device } from '../models/Device';
import { DeviceManager } from '../models/DeviceManager';
import * as r from 'rethinkdb';
import { getDbConnection } from '../db';

@Route('devices')
export class DeviceController {
    deviceManager: DeviceManager = new DeviceManager();

    @Get('/')
    public async getDevices(): Promise<Device[]> {
        await this.deviceManager.initialize();
        const devices = await this.deviceManager.getDevices();
        return devices;
    }

    @Get('{id}')
    public async getDeviceById(id: string): Promise<Device | null> {
        return this.deviceManager.getDeviceById(id) || null;
    }

}