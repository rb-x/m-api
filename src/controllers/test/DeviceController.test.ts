import request from 'supertest';
import { closeDbConnection } from '../../db';
import app from '../../app';
import { stopServer } from '../../server';
import { killFridaProcess } from '../../utils/test';

describe('DeviceController', () => {
  it('should return a list of devices', async () => {
    const res = await request(app)
      .get('/devices')
      .send();

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

afterAll(async () => {
  // find a better way to handle the frida hanging process...
  // await killFridaProcess()
  await closeDbConnection();
  await stopServer()
});