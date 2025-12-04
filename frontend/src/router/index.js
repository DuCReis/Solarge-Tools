// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';

import LoginView from '@/views/LoginView.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';

import DashboardView from '@/views/DashboardView.vue';
import RejectionsView from '@/views/RejectionsView.vue';
import PeelForceView from '@/views/PeelForceView.vue';
import SnapshotsView from '@/views/SnapshotsView.vue';
import RecipeChangesView from '@/views/RecipeChangesView.vue';
import MaintenanceView from '@/views/MaintenanceView.vue';
import RibbonSpoolsView from '@/views/RibbonSpoolsView.vue';
import PeelForceDetailView from '@/views/PeelForceDetailView.vue';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        // LOGIN — única rota pública
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },

        // RESTO — tudo protegido
        {
            path: '/',
            component: DashboardLayout,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: DashboardView,
                },
                {
                    path: 'peel-force',
                    name: 'peel-force',
                    component: PeelForceView,
                },
                {
                    path: 'peel-force/:id',
                    name: 'peel-force-detail',
                    component: PeelForceDetailView,
                },
                {
                    path: 'string-rejections',
                    name: 'string-rejections',
                    component: RejectionsView,
                },
                {
                    path: 'snapshots',
                    name: 'snapshots',
                    component: SnapshotsView,
                },
                {
                    path: 'recipe-changes',
                    name: 'recipe-changes',
                    component: RecipeChangesView,
                },
                {
                    path: 'maintenance',
                    name: 'maintenance',
                    component: MaintenanceView,
                },
                {
                    path: 'ribbon-spools',
                    name: 'ribbon-spools',
                    component: RibbonSpoolsView,
                },
            ],
        },

        // Qualquer caminho estranho → login
        {
            path: '/:pathMatch(.*)*',
            redirect: '/login',
        },
    ],
});

// Guard global
router.beforeEach((to, from, next) => {
    const auth = useAuthStore();
    const isLoggedIn = auth.isAuthenticated;

    // 1) /login é sempre acessível (mas se já estiver logado, redireciona)
    if (to.name === 'login') {
        if (isLoggedIn) {
            return next({ name: 'dashboard' });
        }
        return next();
    }

    // 2) Qualquer outra rota → precisa estar autenticado
    if (!isLoggedIn) {
        return next({
            name: 'login',
            query: { redirect: to.fullPath },
        });
    }

    // 3) Autenticado → segue
    next();
});

export default router;
