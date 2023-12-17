export class Device {
  id: string;
  name: string;
  detectedBy: string;
  hash: string;

  constructor(id: string, name: string, detectedBy: string, hash: string) {
      this.id = id;
      this.name = name;
      this.detectedBy = detectedBy;
      this.hash = hash;
  }
}