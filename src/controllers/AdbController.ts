import { Route, Get, Post, Delete, Body } from 'tsoa';
import { AdbManager } from '../models/AdbManager';

@Route('devices/{deviceId}/adb')
export class AdbController {
    adbManager: AdbManager = new AdbManager();

    @Get('getApplications')
    public async getApplications(deviceId: string) {
        return this.adbManager.getApplications(deviceId);
    }

    @Post('install')
    public async install(deviceId: string, @Body() body: { packageName: string }) {
        const { packageName } = body;
        // return this.adbManager.install(deviceId, packageName);
        return packageName
    }

    @Post('uninstall')
    public async uninstall(deviceId: string, @Body() body: { packageName: string }) {
        const { packageName } = body;
        // return this.adbManager.uninstall(deviceId, packageName);
        return packageName
    }


}