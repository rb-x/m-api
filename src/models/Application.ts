export class Application {
    id: string;
    packageName: string;
    location: string;
    // Add other properties here...

    constructor(id: string, packageName: string, location: string) {
      this.id = id;
      this.packageName = packageName;
      this.location = location;
      // Initialize other properties here...
    }
}