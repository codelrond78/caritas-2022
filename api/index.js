import express from 'express';
import mongoose from 'mongoose';

const app = express();

mongoose.connect(process.env.MONGODB_URI);
const Cat = mongoose.model('Cat', { name: String });

app.post('/api/kitty', async (req, res) => {
    const kitty = new Cat({ name: 'fifi' });
    await kitty.save();
    res.end(JSON.stringify(kitty));
});

app.get('/api/g', (req, res) => {
    res.end('g:)');
});

export default app;