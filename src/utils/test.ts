const { spawn } = require('child_process');

export const killFridaProcess = () => {
  const fridaProcess = spawn('pkill', ['-f', 'frida']);
  fridaProcess.on('exit', () => {
    console.log('Frida process killed');
  });
};
