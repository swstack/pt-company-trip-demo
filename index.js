let sdk = require('bean-sdk').sdk()


function logAndExit(err, msg) {
  if (err) {
    console.log(msg)
    process.exit(1)
  }
}


function connectBean(name, callback) {
  sdk.on('discover', (scannedDevice)=> {

    if (scannedDevice.getName() === name) {
      console.log(`Found Bean with name ${name}`)
      sdk.stopScanning()

      sdk.connectScannedDevice(scannedDevice, (err, bean)=> {
        logAndExit(err, `Bean connection failed: ${err}`)
        console.log('Connected')

        bean.lookupServices((err)=> {
          logAndExit(err, `Service lookup FAILED: ${err}`)
          console.log('All services discovered.')

          callback(bean)

        })
      })
    }
  })

  sdk.startScanning()
}


function sendEmail(to, from, body) {

}


connectBean('DemoBean', (bean)=> {
  console.log('Suh.')
})
