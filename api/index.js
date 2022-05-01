import express from 'express';
const app = express();

app.get('/api/f', (req, res) => {
    res.end('f:)');
});

app.get('/api/g', (req, res) => {
    res.end('g:)');
});

export default app;
