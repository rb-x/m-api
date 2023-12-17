import crypto from 'crypto';

export function generateHashForDevice(id: string, detectionType: string, name: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(id + detectionType + name);
    return hash.digest('hex');
}