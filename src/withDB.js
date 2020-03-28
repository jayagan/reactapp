import {MongoClient} from 'mongodb';

let client;
let db;

const withDB = async (operations)=>{

    try {
        if (!db) {
            client = await MongoClient.connect(
                'mongodb://localhost:27017',
                {useNewUrlParser: true, useUnifiedTopology: true}
            );
    
            db = await client.db('react-blog-db');
        }

        await operations(db);
    } catch(e) {
        operations(null);
        console.log(e);
    }  
   
}

export default withDB;