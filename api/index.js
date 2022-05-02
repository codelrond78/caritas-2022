import express from 'express';
import mongoose from 'mongoose';
import { expressjwt } from 'express-jwt';
import jwks from 'jwks-rsa';
import bodyParser from 'body-parser';

var jwtCheck = expressjwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-qni6mx5z.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://caritas2022.devme.fun',
  issuer: 'https://dev-qni6mx5z.us.auth0.com/',
  algorithms: ['RS256']
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(process.env.MONGODB_URI);
//const Cat = mongoose.model('Cat', { name: String });

const fichaSchema = new mongoose.Schema({
    members: [{name: String}]
  });

const Ficha = mongoose.model('Ficha', fichaSchema);

app.post('/api/ficha', jwtCheck, async (req, res) => {
    const mig = new Ficha(req.body);
    await mig.save();
    res.end(JSON.stringify(mig));
})

app.put('/api/ficha/:id', jwtCheck, async (req, res) => {
    const mig = await Ficha.findByIdAndUpdate(req.params.id, req.body, 'after')
    await mig.save();
    res.end(JSON.stringify(mig));
})

app.get('/api/ficha/:id', jwtCheck, async (req, res) => {
    const mig = await Ficha.findById(req.params.id)
    res.end(JSON.stringify(mig));
})

/*
app.post('/api/kitty', async (req, res) => {
    const kitty = new Cat({ name: 'fifi' });
    await kitty.save();
    res.end(JSON.stringify(kitty));
});
*/

app.get('/api/g', jwtCheck, (req, res) => {
    res.end('g:)');
});

export default app;
