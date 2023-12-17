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
            const locations: (string | null)[] = location.split('\n').map(path => {
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
        // placeHolder for now
        return null;
    }

    async isFridaInstalled(deviceId: string): Promise<boolean> {
        const fridaInfo = await this.getFridaServerInfo(deviceId);
        return fridaInfo.installed;
    }

    async getFridaServerInfo(deviceId: string): Promise<{ installed: boolean, version?: string, architecture?: string, location?: string, isRunning?: boolean }> {
        const device: DeviceClient = await this.client.getDevice(deviceId);
    
        // Get the architecture of the device
        const architecture = await device.shell('getprop ro.product.cpu.abi')
            .then(adb.util.readAll)
            .then(output => output.toString().trim());
    
        // List the files in the /data/local/tmp directory
        const files = await device.readdir('data/local/tmp');
    
        // Find the frida-server file
        const fridaServerFile = files.find(file => {
            if (file.isFile()) {
                const [name, type, version, platform, arch] = file.name.split('-');
                return name === 'frida' && type === 'server' && /\d+(\.\d+){2}/.test(version) && ['android', 'apple'].includes(platform) && arch === architecture;
            }
            return false;
        });
    
        if (fridaServerFile) {
            const [, , version] = fridaServerFile.name.split('-');
            const location = `/data/local/tmp/${fridaServerFile.name}`;
    
            // Check if the Frida process is running
            const fridaProcess = await device.shell('pgrep -f frida-server')
                .then(adb.util.readAll)
                .then(output => output.toString().trim());
            const isRunning = fridaProcess.length > 0;
    
            return { installed: true, version, architecture, location, isRunning };
        } else {
            return { installed: false };
        }
    }
    async startFridaServer(deviceId: string): Promise<{ pid?: number, location?: string }> {
        const device: DeviceClient = await this.client.getDevice(deviceId);

        // Check if Frida Server is installed
        const fridaServerInfo = await this.getFridaServerInfo(deviceId);
        if (!fridaServerInfo.installed) {
            throw new Error('Frida Server is not installed on the device');
        }

        // Check if Frida Server is already running
        if (fridaServerInfo.isRunning) {
            throw new Error('Frida Server is already running on the device');
        }
        // Set the permissions of the frida-server file
        await device.shell(`chmod 755 ${fridaServerInfo.location}`);

        // Start Frida Server
        const fridaServerStart = await device.shell(`nohup ${fridaServerInfo.location}&; echo $!`)
            .then(adb.util.readAll)
            .then(output => output.toString().trim());

        // Get the PID of the Frida Server process
        const pid = parseInt(fridaServerStart);

        return { pid, location: fridaServerInfo.location };
    }

    async killFridaServer(deviceId: string): Promise<{ pid?: number }> {
        const device: DeviceClient = await this.client.getDevice(deviceId);

        // Check if Frida Server is running
        const fridaServerInfo = await this.getFridaServerInfo(deviceId);
        if (!fridaServerInfo.isRunning) {
            throw new Error('Frida Server is not running on the device');
        }

        // Get the PID of the Frida Server process
        const fridaProcess = await device.shell('pgrep -f frida-server')
            .then(adb.util.readAll)
            .then(output => output.toString().trim());
        const pid = parseInt(fridaProcess);

        // Kill Frida Server
        await device.shell(`kill -9 ${pid}`);

        return { pid };
    }




}