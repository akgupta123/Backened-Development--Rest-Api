const express = require('express')
const router = express.Router()
const Room = require('../models/room')

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find()
    res.json(rooms)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', getRoom, (req, res) => {
  res.json(res.subscriber)
})
router.post('/', async (req, res) => {
  const rooms = new Room({
    name: req.body.name,
    room_number: req.body.room_number,
    beds:req.body.beds,
    max_occupancy:req.body.max_occupancy,
    cost_per_night:req.body.cost_per_night,
    reservedRoom:req.body.reservedRoom,
  })
  try {
    const newRooms = await rooms.save()
    res.status(201).json(newRoomsr)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
router.post('/rooms', function(req, res) {

  Room.find({
      type: req.body.roomType,
      beds: req.body.beds,
      max_occupancy: {$gt: req.body.guests},
      cost_per_night: {$gte: req.body.priceRange.lower, $lte: req.body.priceRange.upper},
      reserved: { 
          $not: {
              $elemMatch: {from: {$lt: req.body.to.substring(0,10)}, to: {$gt: req.body.from.substring(0,10)}}
          }

      }
  }, function(err, rooms){
      if(err){
          res.send(err);
      } else {
          res.json(rooms);
      }
  });

});
router.post('/rooms/reserve', function(req, res) {

  console.log(req.body._id);

  Room.findByIdAndUpdate(req.body._id, {
      $push: {"reserved": {from: req.body.from, to: req.body.to}}
  }, {
      safe: true,
      new: true
  }, function(err, room){
      if(err){
          res.send(err);
      } else {
          res.json(room);
      }
  });

});

router.patch('/:id', getRoom, async (req, res) => {
  if (req.body.name != null) {
    res.room.name = req.body.name
  }
  if (req.body.room_number != null) {
    res.room.room_number = req.body.room_number;
  }
  if (req.body.beds != null) {
    res.room.beds = req.body.beds;
  }
  if (req.body.max_occupancy != null) {
    res.room.max_occupancy = req.body.max_occupancy;
  }
  if (req.body.cost_per_night != null) {
    res.room.cost_per_night = req.body.cost_per_night;
  }
  if (req.body.reservedRoom != null) {
    res.room.reservedRoom = req.body.reservedRoom;
  }
  try {
    const updatedRoom = await res.room.save()
    res.json(updatedRoom)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
router.delete('/:id', getRoom, async (req, res) => {
  try {
    await res.room.remove()
    res.json({ message: 'Deleted Room' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getRoom(req, res, next) {
  let room
  try {
    room = await Room.findById(req.params.id)
    if (room == null) {
      return res.status(404).json({ message: 'Cannot room' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.room = room;
  next();
}

module.exports = router;