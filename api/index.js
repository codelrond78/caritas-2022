import express from 'express';
import mongoose from 'mongoose';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

var jwtCheck = jwt({
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

mongoose.connect(process.env.MONGODB_URI);
const Cat = mongoose.model('Cat', { name: String });

app.post('/api/kitty', async (req, res) => {
    const kitty = new Cat({ name: 'fifi' });
    await kitty.save();
    res.end(JSON.stringify(kitty));
});

app.get('/api/g', jwtCheck, (req, res) => {
    res.end('g:)');
});

export default app;
