import express from 'express';
const app = express();

app.all('*', (req, res) => {
    console.log(req.path)
    res.send('hello world')
})

app.listen(3000, () => {console.log('running on 3000')})