import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {type: 'String'},
  surname: {type: 'String'},
  date_of_birth: {type: 'Date', default: Date.now},
  gender: {type: 'String'},
  disciplines: [
    {type: 'String'}
  ],
  sponsored_by: [
    {type: 'String'}
  ],
  achievements: [
    {
      type: {type: 'String'},
      rank: {type: 'Number'},
      event: {
        eventname: {type: 'String'},
        discipline: {type: 'String'},
        location: {type: 'String'},
        date: {type: 'Date', default: Date.now},
        run: {type: 'String'}
      },
      time_in_milliseconds: {type: 'Number'}
    }]
});

const disciplineSchema = new Schema({
  discname: {type: 'String'}
});

const sponsorSchema = new Schema({
  sponsorname: {type: 'String'}
});

const eventSchema = new Schema({
  eventname: {type: 'String'},
  discipline: {type: 'String'},
  location: {type: 'String'},
  date: {type: 'Date', default: Date.now},
  run: {type: 'String'}
});

const Item = mongoose.model('Item', itemSchema, 'items');
const DiscItem = mongoose.model('DiscItem', disciplineSchema, 'items');
const SponsItem = mongoose.model('SponsItem', sponsorSchema, 'items');
const EventItem = mongoose.model('EventItem', eventSchema, 'items');




export {
  Item, DiscItem, SponsItem, EventItem
}
//export default mongoose.models;
//export default mongoose.model('Item', itemSchema); //Racer
