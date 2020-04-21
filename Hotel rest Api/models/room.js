
const mongoose = require('mongoose');

const room = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  room_number:{
    type: Number,
    required: true
  },
  beds: {
    type:Number,
    required:true
  },
  max_occupancy: {
    type:Number,
    required:true
  },
  cost_per_night:{
    type:Number,
    required:true
  },
  reserveDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  reservedRoom: [
    {
        from: String,
        to: String
    }]

});
module.exports = mongoose.model('Hotel', room);

var room1=module.exports
 = mongoose.model('Room', {
  room_number: Number,
  type: String,
  beds: Number,
  max_occupancy: Number,
  cost_per_night: Number,
  reserved: [
      {
          from: String,
          to: String
      }
  ]
});
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

room1.remove({}, function(res){
  console.log("removed records");
});

room1.count({}, function(err, count){
  console.log("rooms",+count);

  if(count === 0){

      var recordsToGenerate = 150;

      var roomTypes = [
          'standard',
          'villa',
          'penthouse',
          'studio'
      ];

      for(var i = 0; i < recordsToGenerate; i++){
          var newRoom = new room1({
              room_number: i,
              type: roomTypes[getRandomInt(0,3)],
              beds: getRandomInt(1, 6),
              max_occupancy: getRandomInt(1, 8),
              cost_per_night: getRandomInt(50, 500),
              reserved: [
                  {from: '2020-01-01', to: '2020-01-02'},
                  {from: '2019-04-18', to: '2019-04-23'},
                  {from: '2018-01-29', to: '2018-01-30'}
              ]
          });

          newRoom.save(function(err, doc){
              console.log("Created test document" + doc._id);
          });
      }

  }
});