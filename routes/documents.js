var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('pagereader', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'pagereader' database");
        db.collection('documents', {safe:true}, function(err, collection) {
            //if (err) {
                collection.remove(function(err, collection){});
                console.log("The 'documents' collection doesn't exist. Creating it with sample data...");

            //}
        });
        populateDB();

    }
});


exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving document: ' + id);
    db.collection('documents', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('documents', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addDocument = function(req, res) {
    var document = req.body;
    console.log('Adding document: ' + JSON.stringify(document));
    db.collection('documents', function(err, collection) {
        collection.insert(document, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateDocument = function(req, res) {
    var id = req.params.id;
    var document = req.body;
    console.log('Updating document: ' + id);
    console.log(JSON.stringify(document));
    db.collection('documents', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, document, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating document: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(document);
            }
        });
    });
}
 
exports.deleteDocument = function(req, res) {
    var id = req.params.id;
    console.log('Deleting document: ' + id);
    db.collection('documents', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var documents = [
    {
        title: "MacBeth",
        author: "William Shakespeare",
        date: "Tue Mar 05 2013 16:37:57 GMT-0600 (Central Standard Time)",
        "meta-inf": "localhost:8000/data/macbeth/META-INF/container.xml"
    }];

    db.collection('documents', function(err, collection) {
        collection.insert(documents, {safe:true}, function(err, result) {});
    });

};