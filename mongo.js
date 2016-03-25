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
                            if(err) res.status(500).json({message: 'error'});
                            else {
                                res.status(200).json({message: 'okay'});   
                            }
                        });
                    }
                });
        } else {
            res.status(401).json({message: 'unauthorized'});
        }
    });
    
}