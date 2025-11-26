import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import ProductDetail from "../pages/ProductDetail.vue";
import Cart from "../pages/Cart.vue";
import Checkout from "../pages/Checkout.vue";
import Profile from "../pages/Profile.vue";
import Auth from "../pages/Auth.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/product/:id", component: ProductDetail },
    { path: "/cart", component: Cart },
    { path: "/checkout", component: Checkout },
    { path: "/profile", component: Profile },
    { path: "/auth", component: Auth },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
