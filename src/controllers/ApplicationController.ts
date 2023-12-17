import { Route, Get } from 'tsoa';
import { Application } from '../models/Application';
import { ApplicationManager } from '../models/ApplicationManager';

@Route('devices/{deviceId}/apps')
export class ApplicationController {
    applicationManager: ApplicationManager = new ApplicationManager();

    @Get('/')
    public async getApplicationsByDeviceId(deviceId: string): Promise<Application[]> {
        return await this.applicationManager.getApplications(deviceId);
    }

    @Get('{appName}')
    public async getApplicationByDeviceIdAndAppName(deviceId: string, appName: string): Promise<Application | null> {
        return this.applicationManager.getApplicationById(deviceId, appName) || null;
    }
}