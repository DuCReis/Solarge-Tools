import db from '../models/index.js';
import {
    createStringRejection,
    listStringRejections,
} from '../services/stringRejectionService.js';

const ALLOWED_SOURCE = ['MACHINE', 'OPERATOR'];
const ALLOWED_CATEGORY = ['UPS', 'MC', 'RM', 'BC', 'OTHER', 'GOOD_REJECTED'];
const ALLOWED_SIDE = ['LEFT', 'CENTER', 'RIGHT'];

export async function createStringRejectionController(req, res) {
    try {
        const operatorId = req.user?.id || null;

        const {
            machineId,
            snapshotId,
            source,
            category,
            side,
            isGoodString,
            mcX,
            mcY,
            notes,
        } = req.body;

        // 1) obrigatórios
        if (!machineId) {
            return res.status(400).json({ message: 'machineId é obrigatório.' });
        }
        if (!source) {
            return res.status(400).json({ message: 'source é obrigatório (MACHINE/OPERATOR).' });
        }
        if (!category) {
            return res.status(400).json({ message: 'category é obrigatório.' });
        }

        // 2) enums
        if (!ALLOWED_SOURCE.includes(source)) {
            return res.status(400).json({
                message: `source inválido. Permitidos: ${ALLOWED_SOURCE.join(', ')}`,
            });
        }

        if (!ALLOWED_CATEGORY.includes(category)) {
            return res.status(400).json({
                message: `category inválido. Permitidos: ${ALLOWED_CATEGORY.join(', ')}`,
            });
        }

        if (side && !ALLOWED_SIDE.includes(side)) {
            return res.status(400).json({
                message: `side inválido. Permitidos: ${ALLOWED_SIDE.join(', ')}, ou vazio.`,
            });
        }

        // 3) snapshot (se vier) tem de existir
        let validSnapshotId = null;
        if (snapshotId) {
            const snap = await db.MachineProductionSnapshot.findByPk(snapshotId);
            if (!snap) {
                return res.status(400).json({
                    message: `Snapshot com id ${snapshotId} não existe.`,
                    field: 'snapshotId',
                });
            }
            validSnapshotId = snap.id;
        }

        // 4) MC coords (se for MC, validar 0–1; se não for, ignorar)
        let validMcX = null;
        let validMcY = null;

        if (category === 'MC') {
            if (mcX == null || mcY == null) {
                return res.status(400).json({
                    message: 'Para category=MC, mcX e mcY são obrigatórios.',
                });
            }

            const fX = parseFloat(mcX);
            const fY = parseFloat(mcY);

            if (Number.isNaN(fX) || Number.isNaN(fY)) {
                return res.status(400).json({
                    message: 'mcX e mcY devem ser números.',
                });
            }

            if (fX < 0 || fX > 1 || fY < 0 || fY > 1) {
                return res.status(400).json({
                    message: 'mcX e mcY devem estar entre 0 e 1 (normalizado).',
                });
            }

            validMcX = fX;
            validMcY = fY;
        }

        const payload = {
            operatorId,
            machineId,
            snapshotId: validSnapshotId,
            source,
            category,
            isGoodString: !!isGoodString,
            side: side || null,
            mcX: validMcX,
            mcY: validMcY,
            notes: notes || null,
        };

        const record = await createStringRejection(payload);
        return res.status(201).json(record);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating string rejection' });
    }
}


export async function listStringRejectionsController(req, res) {
    try {
        const filters = {
            machineId: req.query.machineId,
            source: req.query.source,
            category: req.query.category,
            from: req.query.from,
            to: req.query.to,
        };

        if (req.query.isGoodString === 'true') {
            filters.isGoodString = true;
        } else if (req.query.isGoodString === 'false') {
            filters.isGoodString = false;
        }

        const page = parseInt(req.query.page || '1', 10);
        const limit = Math.min(parseInt(req.query.limit || '200', 10), 500);
        const offset = (page - 1) * limit;

        const list = await listStringRejections(filters, { limit, offset });

        return res.json(list);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error loading string rejections' });
    }
}


