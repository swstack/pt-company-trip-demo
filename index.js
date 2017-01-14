let sdk = require('bean-sdk').sdk()
let async = require('async')


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
  console.log(`Sending email from ${from} to ${to} with body ${body}`)
}


connectBean('DemoBean', (bean)=> {
  let accel = {};

  async.whilst(

    // Test
    function() {
      // If accel is flipped over, return False
      if (accel.z_axis < 0) {
        return false
      } else {

        console.log('.')
        return true
      }

    },

    // iteratee
    function(callback) {

      bean.readAccelerometer((err, response)=> {
        accel = response
        callback(err)
      })
    },

    // Error/Done
    function (err, n) {
      // All done, send an email
      sendEmail('sstack@punchthrough.com', 'sstack@punchthrough.com', 'You Da Worst')
    }
  )

})
