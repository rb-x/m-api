import * as frida from "frida";
import { Device } from "./Device";
import { Application, FridaApplication } from "./Application";
import { generateHashForDevice } from "../utils/hash";

export class FridaManager {
  devices: Device[] = [];
  deviceIdsToUuids: Map<string, string> = new Map();

  async initialize() {
    const fridaDevices = await frida.enumerateDevices();
    this.devices = fridaDevices.map(device => {
      let hash = generateHashForDevice(device.id, 'Frida', device.name);
      return new Device(device.id, device.name, 'Frida', hash);
    });
    
  }

  async getApplications(deviceId: string): Promise<FridaApplication[]> {
    // TODO 
    try {
        // const device = await frida.getDevice(deviceId);
        // const applications = await device.enumerateApplications();
        // return applications.map(app => new FridaApplication(app.id, app.name, app.path, app.pid));
        return []
    } catch (error) {
        console.error(`Failed to get applications for device ${deviceId}: ${error}`);
        return [];
    }
}

  async getApplicationById(deviceId: string, appId: string): Promise<Application | null> {
    // Logic to fetch a specific application from the device using Frida
    // This is just a placeholder, replace with actual logic
    return null;
  }

  getDeviceById(id: string): Device | undefined {
    return this.devices.find(device => device.id === id);
  }

  async spawnApplicationByPackageName(deviceId: string, packageName: string): Promise<void|object> {
    try {
      const device = await frida.getDevice(deviceId);
      const pid = await device.spawn(packageName);
      console.log(`Spawned application ${packageName} on device ${deviceId} with pid ${pid}`);
      return { status: 'ok', message: `Successfully spawned application ${packageName} on device ${deviceId}` };
    } catch (error) {
      console.error(`Failed to spawn application ${packageName} on device ${deviceId}: ${error}`);
      return { status: 'error', message: `Failed to spawn application ${packageName} on device ${deviceId}: ${error}` };
    }
  }

  async spawnApplicationByPackageNameAndInjectScript(deviceId: string, packageName: string, script: string): Promise<void|object> {
    try {
      const device = await frida.getDevice(deviceId);
      const pid = await device.spawn(packageName);
      console.log(`Spawned application ${packageName} on device ${deviceId} with pid ${pid}`);
      const session = await device.attach(pid);
      const scriptObj = await session.createScript(script);
      await scriptObj.load();
      console.log(`Injected script into application ${packageName} on device ${deviceId}`);
      return { status: 'ok', message: `Successfully spawned and injected script into application ${packageName} on device ${deviceId}` };
    } catch (error) {
      console.error(`Failed to spawn application and inject script into ${packageName} on device ${deviceId}: ${error}`);
      return { status: 'error', message: `Failed to spawn application and inject script into ${packageName} on device ${deviceId}: ${error}` };
    }
  }


}