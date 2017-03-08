var models = require('../../server/server').models;
var fs = require('fs');
var filePath = "../data/filllist";
const async = require('async');
var split = require('split');

var Instrument = models.instrument;
var instruments = [];

fs.createReadStream("data/filllist").pipe(split()).on('data', function(line) {
  var formattedData = formatData(line);
  if (formattedData && formattedData.hasOwnProperty('id') && formattedData.hasOwnProperty('activity') && formattedData.hasOwnProperty('count')) {
    instruments.push(formattedData);
  }
}).on('end', function() {
  createOrInsertData();
});

function createOrInsertData() {
  async.eachSeries(instruments, function(instrument, acb) {
    var position = instrument.activity * instrument.count;
    Instrument.findById(instrument.id, function(err, instance) {
      if (err) {
        console.log(err);
        return acb(err);
      }
      if (!instance) {
        //create new
        console.log("Creating instance");
        Instrument.create({
          id: instrument.id,
          position: position
        }, function(err, createdInstance) {
          if (err) {
            return acb(err);
          }
          return acb();
        })

      } else {
        //update existing
        console.log("Updating instance");
        instance.position = instance.position + position;
        instance.save(function(err, updatedInstance) {
          if (err) {
            return acb(err);
          }
          return acb();
        })
      }

    });
  }, function(err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    console.log("Data created successfully");
    process.exit(0);
  });
}

function formatData(data) {
  var newdata = {};
  if (!data.split(":")[1]) {
    return;
  }
  var values = data.split(":")[1].split("|");
  values.forEach(function(val) {
    if (val) {
      var temp = val.split("=");
      if (temp[0] == "54") {
        if (temp[1] == "1") {
          newdata.activity = 1;
        } else if (temp[1] == "2") {
          newdata.activity = -1;
        }
      } else if (temp[0] == "48") {
        newdata.id = parseInt(temp[1]);
      } else if (temp[0] == "32") {
        newdata.count = parseInt(temp[1]);
      }
    }
  })
  return newdata;
}
