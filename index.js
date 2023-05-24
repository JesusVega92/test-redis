
const express = require('express');
const axios = require('axios');
const resTime = require('response-time');
const redis = require('async-redis');

const client =  redis.createClient({
  host: 'redis',  
  port: 6379
})
const app = express();

app.use(resTime())


app.get('/character', async (req, res) => {
  try {
    const characters = await client.get('characters')
    if(characters) res.json(JSON.parse(characters));
    else {
      const response = await axios.get("https://rickandmortyapi.com/api/character");
      await client.set("characters", JSON.stringify(response.data));
      console.log('Set "characters" key successfully.');
      res.json(response.data);
    }
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  } 
});

app.listen(3000, () => {
  console.log('Server on port 3000');
});