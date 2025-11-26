import express from 'express';
import cors from 'cors';
import db from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import machineRoutes from './routes/machineRoutes.js';
import peelForceRoutes from './routes/peelForceRoutes.js';
import stringRejectionRoutes from './routes/stringRejectionRoutes.js';
import snapshotRoutes from './routes/machineProductionSnapshotRoutes.js';
import machineRecipeChangeRoutes from './routes/machineRecipeChangeRoutes.js';
import maintenanceRoutes from './routes/machineMaintenanceRoutes.js';
import ribbonSpoolRoutes from './routes/ribbonSpoolRoutes.js';
import layupEventRoutes from './routes/layupEventRoutes.js';



const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/peel-force', peelForceRoutes);
app.use('/api/string-rejections', stringRejectionRoutes);
app.use('/api/snapshots', snapshotRoutes);
app.use('/api/recipe-changes', machineRecipeChangeRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/ribbon-spools', ribbonSpoolRoutes);
app.use('/api/layup-events', layupEventRoutes);


db.sequelize.authenticate()
    .then(() => console.log('DB connection OK'))
    .catch((err) => console.error('DB connection error:', err));

export default app;
