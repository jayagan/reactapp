import express from 'express';
import bodyParser from 'body-parser';
import {MongoClient} from 'mongodb';
import path from 'path';
import withDB from './withDB';


const app = express();

app.use(express.static(path.join(__dirname, '/build')))

app.use(bodyParser.json());

app.get('/hello', (req, res)=>{
     res.send('Hello!');
});

app.get('/hello/:name', (req, res)=>{
    res.send(`Hello! ${req.params.name}`);
});

app.get('/api/articles/:name', async (req, res) => {
    const articleName = req.params.name;

    await withDB( async db => {
        
    if (!db){
        console.log('Database error');
    }
    else
    {
        const articleInfo = await db.collection('articles')
        .findOne({name:articleName});      

        res.status(200).json(articleInfo);
    }

    })    

});

app.post('/api/articles/:name/upvote', async (req, res)=>{
    const articleName = req.params.name;

    await withDB( async db => {
    
    if (!db){
        console.log('Database error');
        console.trace();
    }
    else
    {
 
        const articleInfo = await db.collection('articles')
            .findOne({name:articleName});
    
        await db.collection('articles').updateOne(
            {name:articleName},
            {'$set': {upvotes:articleInfo.upvotes+1}});
        const updateArticleInfo = await db.collection('articles')
            .findOne({name:articleName});
    
        res.status(200).json(updateArticleInfo);
    }
    })
  
   
});

app.post('/api/articles/:name/add-comment', async (req, res)=>{
    const articleName = req.params.name;
    const newComment = req.body.comment;

    await withDB( async db => {
    
    if (!db){
        console.log('Database error');
        console.trace();
    }
    else
    {      
        const articleInfo = await db.collection('articles')
            .findOne({name:articleName});
    
        await db.collection('articles').updateOne(
            {name:articleName},
            {'$set': {comments:articleInfo.comments.concat(newComment)}});
        const updateArticleInfo = await db.collection('articles')
            .findOne({name:articleName});
    
        res.status(200).json(updateArticleInfo);
    }
})
   
});

app.post('/api/articles/:name/add-comment', (req, res)=>{
    const articleName = req.params.name;
    const newComment = req.body.comment;
    articlesInfo[articleName].comments.push(newComment);
    res.status(200).send(articlesInfo[articleName]);
});


app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
})

app.listen(8000, () => {
    console.log('server is listening on port 8000!');

});