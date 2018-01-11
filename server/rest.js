import {Item, DiscItem, SponsItem, EventItem} from './schema';
import { toUnicode } from 'punycode';

export function getAllElementsOfCollection(req, res) {
  Item.find().exec((err, items) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({items});
  });
}

export function postNewElement(req, res) {
  let newItem = null;
  if (req.body.name && req.body.surname && req.body.gender && req.body.disciplines && req.body.achievements){  //racer object
    newItem = new Item(req.body);
  } else if (req.body.discname){ //discipline object
    newItem = new DiscItem(req.body);
  } else if (req.body.sponsorname) { //sponsor object
    newItem = new SponsItem(req.body);
  } else if (req.body.eventname && req.body.discipline && req.body.location && req.body.date) { //event object
    newItem = new EventItem(req.body);
  } else {
    res.status(403).end();
  }
  
  newItem.save(function(err, i, aff) {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).end();
  });
}

function formRacer(req){
  let racer = new Item(req.body);
  delete racer['_id'];
  return racer;
}

export function modifyElement(req, res){
  if (!req.body._id) {
    res.status(403).end();
  }
  
  let toUpdate = null;
  if (req.body.name && req.body.surname && req.body.gender && req.body.disciplines && req.body.achievements){  //racer object
    toUpdate = formRacer(req);
  } /*else if (req.body.discname){ //discipline object
    toUpdate = Object.assign(toUpdate, req.body);
  } else if (req.body.sponsorname) { //sponsor object
    toUpdate = Object.assign(toUpdate, req.body);
  } else if (req.body.eventname && req.body.discipline && req.body.location && req.body.date) { //event object
    toUpdate = Object.assign(toUpdate, req.body);
  }*/ else {
    res.status(403).end();
  }

  Item.findOne({_id: req.body._id}).exec((err, item) => {
    if (err) {
      res.status(500).send(err);
    }
    if (item !== null){
      let query = { id: item._id};
      
      item.update(toUpdate,{},(err, result) => {
        if (err) {
          res.status(500).send(err).end();
        } else {
          res.status(200).end();
        }
      });
    }
    else res.status(404).send(err);
  });
}

export function getItemsByKeyValuePair(req, res) {

  let key = req.params.key;
  let value = req.params.value;
  let nested1;
  let nested2;
  let query;

  // not very generic
  if (key.split("$").length === 1) {
    query = key;
  }
  if (key.split("$").length === 2) {
    let splitter = key.split("$");
    key = splitter[0];
    nested1 = splitter[1];
    query = key + "." + nested1;
  }
  if (key.split("$").length === 3) {
    let splitter = key.split("$");
    key = splitter[0];
    nested1 = splitter[1];
    nested2 = splitter[2];
    query = key + "." + nested1 + "." + nested2;
  }

  Item.find({[query]: [value]}).exec((err, items) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({items});
  });
}

export function deleteElement(req, res) {
  Item.findOne({_id: req.params.id}).exec((err, item) => {
    if (err) {
      res.status(500).send(err);
    }

    if (item !== null)
      item.remove(() => {
        res.status(200).end();
      });
    else res.status(404).send(err);
  });
}


