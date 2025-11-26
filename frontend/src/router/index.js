// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '@/views/LoginView.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';

import DashboardView from '@/views/DashboardView.vue';
import RejectionsView from '@/views/RejectionsView.vue';
import PeelForceView from '@/views/PeelForceView.vue';
import LayupEventsView from '@/views/LayupEventsView.vue';
import SnapshotsView from '@/views/SnapshotsView.vue';
import RecipeChangesView from '@/views/RecipeChangesView.vue';
import MaintenanceView from '@/views/MaintenanceView.vue';
import RibbonSpoolsView from '@/views/RibbonSpoolsView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // Login sem layout
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },

        // Tudo o resto usa o layout com sidebar
        {
            path: '/',
            component: DashboardLayout,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: DashboardView,
                    meta: {
                        title: 'Dashboard',
                        subtitle: 'Visão geral das máquinas e eventos registados',
                    },
                },
                {
                    path: 'peel-force',
                    name: 'peel-force',
                    component: PeelForceView,
                    meta: {
                        title: 'Peel Force',
                        subtitle: 'Medições de peel force por máquina / receita',
                    },
                },
                {
                    path: 'string-rejections',
                    name: 'string-rejections',
                    component: RejectionsView,
                    meta: {
                        title: 'String rejections',
                        subtitle: 'MC, UPS, RM, BC, good strings rejeitadas, etc.',
                    },
                },
                {
                    path: 'layup-events',
                    name: 'layup-events',
                    component: LayupEventsView,
                    meta: {
                        title: 'Layup events',
                        subtitle: 'Eventos de layup (skew, missing mesh, wrong cell, ...)',
                    },
                },
                {
                    path: 'snapshots',
                    name: 'snapshots',
                    component: SnapshotsView,
                    meta: {
                        title: 'Machine snapshots',
                        subtitle:
                            'Registo manual de contadores/tempos a partir do HMI das máquinas',
                    },
                },
                {
                    path: 'recipe-changes',
                    name: 'recipe-changes',
                    component: RecipeChangesView,
                    meta: {
                        title: 'Recipe changes',
                        subtitle:
                            'Histórico de alterações de receita da stringer / layup',
                    },
                },
                {
                    path: 'maintenance',
                    name: 'maintenance',
                    component: MaintenanceView,
                    meta: {
                        title: 'Maintenance / Logs',
                        subtitle:
                            'Registos de manutenção preventiva / corretiva e paragens',
                    },
                },
                {
                    path: 'ribbon-spools',
                    name: 'ribbon-spools',
                    component: RibbonSpoolsView,
                    meta: {
                        title: 'Ribbon spools',
                        subtitle:
                            'Gestão de bobines de ribbon por batch, peso, consumo, etc.',
                    },
                },
            ],
        },

        // 404 → volta ao dashboard
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
});

export default router;
