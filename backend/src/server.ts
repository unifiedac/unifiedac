import express from 'express';
import reportRoutes from './routes/report.routes';

const app = express();

app.use(express.json());
app.use('/api', reportRoutes);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on :${port}`);
});
