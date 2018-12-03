var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var objectId = require('mongodb').ObjectId;

var app = express();

//body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = 8080;

app.listen(port);

var db = new mongodb.Db(
        'instagram', 
        new mongodb.Server('localhost', 27017, {}),
        {}
);

console.log('Server on port 8080');

// Create
app.post('/api', function(req, res){
    var data = req.body;
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, col){
            col.insert(data, function(err, records){// apos inserir os dados
                if(err){
                    res.json({'status':'0'});
                }else{
                    res.json({'status':'1'});
                }
                mongoClient.close();
            });
        });
    });
});

// Read
app.get('/api', function(req, res){
    var data = req.body;
    db.open(function(err, mongoClient){
    mongoClient.collection('postagens', function(err, col){
        col.find().toArray(function(err, results){
            if(err){
                res.json(err);
            }else{
                res.json(results);
            }
            });
            mongoClient.close();
         });
    });
});

// Read by ID
app.get('/api/:id', function(req, res){
    var data = req.body;
    db.open(function(err, mongoClient){
    mongoClient.collection('postagens', function(err, col){
        col.find(objectId(req.params.id)).toArray(function(err, results){
            if(err){
                res.json(err);
            }else{
                res.json(results);
            }
            });
            mongoClient.close();
         });
    });
});

// Update
app.put('/api/:id', function(req, res){
    var data = req.body;
    db.open(function(err, mongoClient){
    mongoClient.collection('postagens', function(err, col){
            col.update(
                { _id:objectId(req.params.id) },
                { $set : {titulo:req.body} },
                {},
                function(err, records){
                    if(err){
                        res.json(err);
                    }else{
                        res.json(records);
                    }
                    mongoClient.close();
                }
            );
        });
    });
});

// Delete
app.delete('/api/:id', function(req, res){
    var data = req.body;
    db.open(function(err, mongoClient){
    mongoClient.collection('postagens', function(err, col){
                col.remove({_id:objectId(req.params.id), function(err, records){
                    if(err){
                        res.json(err);
                    }else{
                        res.json(records);
                    }
                    mongoClient.close();
                } 
            });
        });
    });
});
