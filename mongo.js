let MongoClient = require('mongodb').MongoClient;

module.exports = (app) => {
    
    // for inserting new entries
    app.post('/add', (req, res) => {
        if(req.body.query && req.body.data) {
            let query = req.body.query;
            let data = req.body.data;
            MongoClient.connect(
                'mongodb://localhost:27017/koalamate',
                (err, db) => {
                    if(err) res.status(500).json({message: 'error in database'});
                    else {
                        let collection = db.collection('queries');
                        let xmlString = {query: query, data: data};
                        collection.insert(xmlString, (err, result) => {
                            if(err) {
                                res.status(500).json({message: 'error'});
                                // always close db after use, always
                                db.close();
                            }
                            else {
                                res.status(200).json({message: 'okay'});
                                db.close();
                            }
                        });
                    }
                }
            );
        } else {
            res.status(401).json({message: 'unauthorized'});
        }
    });
    
    app.post('/exists', (req, res) => {
        if(req.body.query) {
            let query = req.body.query;
            console.log(query);
            MongoClient.connect(
                'mongodb://localhost:27017/koalamate',
                (err, db) => {
                    if(err) res.status(500).json({message: 'error in database'});
                    else {
                        let collection = db.collection('queries');
                        collection.findOne({ query: query }, (err, item) => {
                            if(err) {
                                res.status(500).json({message: 'error in database'});
                                db.close();
                            }
                            else {
                                if(item) {
                                    // if exists, 200 OK and the json object
                                    res.set('Content-Type', 'text/xml');
                                    res.status(200).send(item['data']);
                                    db.close();
                                }
                                else {
                                    // does not exist
                                    res.status(200).send(false);   
                                    db.close();
                                }
                            }
                        });
                    }
                }
            );
                
        }
        else {
            res.status(401).json({message: 'unauthorized'});
        }
    });
    
    app.get('/history', (req, res) => {
        MongoClient.connect(
            'mongodb://localhost:27017/koalamate',
            (err, db) => {
                if(err) {
                    res.status(500).json({message: 'error in database'});
                    db.close();
                }   
                else {
                    let collection = db.collection('queries');
                    collection.find({}, {query: 1}).toArray(function(err, dataOne) {
                        res.status(200).json({ status: 'success', data: dataOne});
                    });
                }
            }
        );
    });
}