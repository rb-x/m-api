import { Route, Get, Post } from 'tsoa';
import { FridaManager } from '../models/FridaManager';

@Route('devices/{deviceId}/frida')
export class FridaController {
    fridaManager: FridaManager = new FridaManager();

    @Get('getApplications')
    public async getApplications(deviceId: string) {
        // return this.fridaManager.getApplications(deviceId);
    }

    @Post('inject/{moduleName}')
    public async inject(deviceId: string, moduleName: string) {
        // return this.fridaManager.inject(deviceId, moduleName);
        return 'TODO'
    }
}