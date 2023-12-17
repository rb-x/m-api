import { Application } from './Application';
import { AdbManager } from './AdbManager';
import { FridaManager } from './FridaManager';

export class ApplicationManager {
    adbManager: AdbManager = new AdbManager();
    fridaManager: FridaManager = new FridaManager();

    async getApplications(deviceId: string): Promise<Application[]> {
        // Fetch applications from the device using ADB
        const adbApps = await this.adbManager.getApplications(deviceId);
        // Fetch applications from the device using Frida
        const fridaApps = await this.fridaManager.getApplications(deviceId);
        return [...adbApps, ...fridaApps];
    }

    async getApplicationById(deviceId: string, appId: string): Promise<Application | null> {
        // Fetch a specific application from the device using ADB
        const adbApp = this.adbManager.getApplicationById(deviceId, appId);
        if (adbApp) return adbApp;
        // Fetch a specific application from the device using Frida
        const fridaApp = this.fridaManager.getApplicationById(deviceId, appId);
        return fridaApp || null;
    }

    // Add other methods here...
}