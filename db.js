"use strict"
const host = 'localhost', 
    port = 27017,
    authDBName = 'apidb';

let dbServerMap = {};

exports.checkAdminData = function(){
    
    let server = new require('mongodb').Server(host, port, {auto_reconnect: true});
    dbServerMap[authDBName] = new require('mongodb').Db(authDBName, server);
    let db = dbServerMap[authDBName];

    db.open(function(err, db) {
        if(!err) {
            console.log("Connected to 'apidb' database");
            db.collection('authAccount', {strict:true}, function(err, collection) {
                if (err) {
                    console.log("The 'authAccount' collection doesn't exist. Creating it with sample data...");
                    populateDB();
                }
            });
        }
    });

    let populateDB = function() {

        let accounts = [
        {
            name: "admin",
            password: "70444999",
            info:'admin帳號'
        }];

        db.collection('authAccount', function(err, collection) {
            collection.insert(accounts, {safe:true}, function(err, result) {});
        });

    };

}

exports.authAccount = function(account,cb) {
    // let MongoClient = require('mongodb').MongoClient,
    // MongoClient.connect('mongodb://'+host+':'+port+'/'+authDB, function(err, db) {
    //     if(err) {
    //         console.log(err);
    //         cb(false,null);
    //         return;
    //     }
        
    //     if(!db){
    //         cb(false,null);
    //         return;
    //     }

        // Get the collection
        let db = dbServerMap[authDBName];
        let col = db.collection('authAccount');
        col.findOne({username:account.username, password:account.password}, function(err, item) {
            // db.close();
            if(item){
                cb(true,item);    
            }else{
                cb(false,null);
            }
        });
    // });
}

// 未驗證帳號是否已經存在
exports.addAccount = function(account,cb) {
    // var MongoClient = require('mongodb').MongoClient,
    // MongoClient.connect('mongodb://'+host+':'+port+'/'+authDB, function(err, db) {
    //     if(err) {
    //         console.log(err,db);
    //         cb(false);
    //         return;
    //     }
        
    //     if(!db){
    //         cb(false);
    //         return;
    //     }

        // Get the collection
        let db = dbServerMap[authDBName];
        let col = db.collection('authAccount');
        col.insert({username:account.username, password:account.password, info:account.info}, function(err, r) {
            // db.close();
            cb();
        });
    // });
}