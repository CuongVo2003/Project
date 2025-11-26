// resources/js/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";
import ProductDetail from "../pages/ProductDetail.vue";
import Cart from "../pages/Cart.vue";
import Checkout from "../pages/Checkout.vue";
import Profile from "../pages/Profile.vue";
import Auth from "../pages/Auth.vue";

import AdminDashboard from "../pages/Admin/AdminDashboard.vue";
import ProductManage from "../pages/Admin/ProductManage.vue";
import CategoryManage from "../pages/Admin/CategoryManage.vue";
import OrderManage from "../pages/Admin/OrderManage.vue";

const routes = [
    { path: "/", name: "home", component: Home },
    {
        path: "/product/:id",
        name: "product.show",
        component: ProductDetail,
        props: true,
    },
    { path: "/cart", name: "cart", component: Cart },
    { path: "/checkout", name: "checkout", component: Checkout },
    { path: "/profile", name: "profile", component: Profile },
    { path: "/auth", name: "auth", component: Auth },

    {
        path: "/admin/dashboard",
        name: "admin.dashboard",
        component: AdminDashboard,
        meta: { requiresAdmin: true },
    },
    {
        path: "/admin/products",
        name: "admin.products",
        component: ProductManage,
        meta: { requiresAdmin: true },
    },
    {
        path: "/admin/categories",
        name: "admin.categories",
        component: CategoryManage,
        meta: { requiresAdmin: true },
    },
    {
        path: "/admin/orders",
        name: "admin.orders",
        component: OrderManage,
        meta: { requiresAdmin: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
