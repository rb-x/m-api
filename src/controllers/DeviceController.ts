import { Route, Get } from 'tsoa';
import { Device } from '../models/Device';
import { DeviceManager } from '../models/DeviceManager';

@Route('devices')
export class DeviceController {
    deviceManager: DeviceManager = new DeviceManager();

    @Get('/')
    public async getDevices(): Promise<Device[]> {
        await this.deviceManager.initialize();
        const devices = await this.deviceManager.getDevices();
        return devices;
    }

    @Get('{deviceId}')
    public async getDeviceById(deviceId: string): Promise<Device | null> {
        return this.deviceManager.getDeviceById(deviceId) || null;
    }

    @Get('/{deviceId}/fridaVersion')
    public async getFridaVersion(deviceId: string): Promise<{ installed: boolean, version?: string, architecture?: string, location?: string }> {
        return this.deviceManager.getFridaVersion(deviceId);
    }

    @Get('/{deviceId}/startFridaServer')
    public async startFridaServer(deviceId: string): Promise<{ pid?: number, location?: string }> {
        return this.deviceManager.adbManager.startFridaServer(deviceId);
    }

    @Get('/{deviceId}/killFridaServer')
    public async killFridaServer(deviceId: string): Promise<{ pid?: number }> {
        return this.deviceManager.adbManager.killFridaServer(deviceId);
    }

    @Get('/{deviceId}/installFridaServer')
    public async installFridaServer(deviceId: string): Promise<{ installed?: boolean, location?: string }> {
        return this.deviceManager.installLatestFrida(deviceId);
    }

}