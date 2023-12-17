import adb, { Client, Device as AdbDevice, DeviceClient } from '@devicefarmer/adbkit'
import { Device } from './Device';
import { Application } from './Application';
import { generateHashForDevice } from '../utils/hash';
import bb from 'bluebird'
import { Duplex } from 'stream';

export class AdbManager {
    client: Client = adb.createClient();
    devices: Device[] = [];

    async initialize() {
        const adbDevices = await this.client.listDevices();
        this.devices = adbDevices.map((device: AdbDevice) => {
            let hash = generateHashForDevice(device.id, 'ADB', device.type);
            return new Device(device.id, device.type, 'ADB', hash);
        });
    }

    async getDevices(): Promise<Device[]> {
        const adbDevices = await this.client.listDevices();
        return adbDevices.map((device: AdbDevice) => {
            let hash = generateHashForDevice(device.id, 'ADB', device.type);
            return new Device(device.id, device.type, 'ADB', hash);
        });
    }

    async getDeviceById(id: string): Promise<Device | null> {
        const devices = await this.client.listDevices();
        const device = devices.find((device: AdbDevice) => device.id === id);
        return device ? new Device(device.id, device.type, 'ADB', id) : null;
    }



async getApplications(deviceId: string): Promise<Application[]> {
    const device: DeviceClient = await this.client.getDevice(deviceId);
    const pkgs = await device.getPackages();
    const apps = await bb.map(pkgs, async (pkg: string) => {
        let locationStream: Duplex = await device.shell(`pm path ${pkg}`);
        let location = '';
        locationStream.on('data', (data) => {
            location += data.toString();
        });
        await new Promise((resolve) => {
            locationStream.on('end', resolve);
        });
        const locations : (string|null)[] = location.split('\n').map(path => {
            const match = path.match(/package:(.*)/);
            return match ? match[1].trim() : null;
        }).filter(Boolean);
        const id = pkg;
        const packageName = pkg;
        const app = new Application(id, packageName, locations[0] || '');
        return app;
    });
    return apps;
}



    async getApplicationById(deviceId: string, appId: string): Promise<Application | null> {
        // Logic to fetch a specific application from the device using ADB
        // This is just a placeholder, replace with actual logic
        return null;
    }
}