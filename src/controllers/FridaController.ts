import { Route, Get, Post, Body } from 'tsoa';
import { FridaManager } from '../models/FridaManager';

@Route('devices/{deviceId}/frida')
export class FridaController {
    fridaManager: FridaManager = new FridaManager();

    @Get('getApplications')
    public async getApplications(deviceId: string) {
        return this.fridaManager.getApplications(deviceId);
    }

    @Post('inject/{moduleName}')
    public async inject(deviceId: string, moduleName: string) {
        // return this.fridaManager.inject(deviceId, moduleName);
        return 'TODO'
    }

    @Post('spawn')
    public async spawnApplicationByPackageName(@Body() body: { deviceId: string, packageName: string }) {
        const { deviceId, packageName } = body;
        return await this.fridaManager.spawnApplicationByPackageName(deviceId, packageName);
    }


    @Post('spawnAndInject')
    public async spawnAndInject(@Body() body: { deviceId: string, packageName: string, b64EncodedScript: string }) {
        const { deviceId, packageName, b64EncodedScript } = body;
        const b64DecodedFridaScript = Buffer.from(b64EncodedScript, 'base64').toString();
        return {deviceId,packageName,b64DecodedFridaScript}
    }

}