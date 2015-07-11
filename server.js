var express = require('express');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.remove = function(id){
	return this.items.splice(id,1);
	
}

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.delete('/items/:id',function(req,res){
	console.log("IN");
	var id = parseInt(req.params.id);
	console.log(id);
	if(id < 0 || id >= storage.items.length){
		return res.status(400);
	}
	res.status(200);
	return res.json(storage.remove(id)[0]);
});

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    console.log(req.body);
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.put('/items/:id',jsonParser,function(req,res){
	console.log("in");
	if(!req.body){
		return res.sendStatus(400);
	}
	storage.items[parseInt(req.body.id)].name = req.body.name;
	return storage.items[parseInt(req.body.id)];
});



app.listen(8080);