const frida = require('frida')

frida.enumerateDevices()
  .then(devices => {
    console.log(devices);
  })
  .catch(err => {
    console.error(err);
  });
