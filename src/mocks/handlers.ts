import { http, HttpResponse, delay } from 'msw';

// Scenario types
type LoginScenario = 'success' | 'invalid_password' | 'email_not_found' | 'server_error';
type MeScenario = 'success' | 'token_expired' | 'server_error';
type ProductsScenario = 'success' | 'server_error';

// LocalStorage keys for scenario control
const SCENARIO_KEYS = {
    login: 'msw_login_scenario',
    me: 'msw_me_scenario',
    products: 'msw_products_scenario',
    delay: 'msw_delay',
    userRole: 'msw_user_role',
};

// Helper to get scenario from localStorage
const getScenario = <T extends string>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    return (localStorage.getItem(key) as T) || defaultValue;
};

// Helper to get delay from localStorage
const getDelay = (): number => {
    if (typeof window === 'undefined') return 0;
    const delayStr = localStorage.getItem(SCENARIO_KEYS.delay);
    return delayStr ? parseInt(delayStr, 10) : 0;
};

// Helper to check Authorization header
const checkAuth = (request: Request): { authorized: boolean; token: string | null } => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { authorized: false, token: null };
    }
    return { authorized: true, token: authHeader.replace('Bearer ', '') };
};

// Mock products data
const mockProducts = [
    { id: 1, name: '筆記型電腦', price: 25000, description: '輕薄高效能筆記型電腦，適合工作與娛樂' },
    { id: 2, name: '無線滑鼠', price: 890, description: '人體工學設計，支援多裝置連接' },
    { id: 3, name: '機械鍵盤', price: 3200, description: '青軸機械鍵盤，打字手感極佳' },
];

export const handlers = [
    // POST /api/login
    http.post('/api/login', async () => {
        await delay(getDelay());

        const scenario = getScenario<LoginScenario>(SCENARIO_KEYS.login, 'success');
        const userRole = getScenario<'admin' | 'user'>(SCENARIO_KEYS.userRole, 'admin');

        switch (scenario) {
            case 'invalid_password':
                return HttpResponse.json(
                    { message: '密碼錯誤' },
                    { status: 401 }
                );
            case 'email_not_found':
                return HttpResponse.json(
                    { message: '帳號不存在' },
                    { status: 401 }
                );
            case 'server_error':
                return HttpResponse.json(
                    { message: '伺服器錯誤，請稍後再試' },
                    { status: 500 }
                );
            case 'success':
            default:
                return HttpResponse.json({
                    accessToken: 'fake.jwt.token',
                    user: {
                        username: 'dean',
                        role: userRole,
                    },
                });
        }
    }),

    // GET /api/me
    http.get('/api/me', async ({ request }) => {
        await delay(getDelay());

        const { authorized } = checkAuth(request);
        if (!authorized) {
            return HttpResponse.json(
                { message: '未授權，請重新登入' },
                { status: 401 }
            );
        }

        const scenario = getScenario<MeScenario>(SCENARIO_KEYS.me, 'success');
        const userRole = getScenario<'admin' | 'user'>(SCENARIO_KEYS.userRole, 'admin');

        switch (scenario) {
            case 'token_expired':
                return HttpResponse.json(
                    { message: '登入已過期，請重新登入' },
                    { status: 401 }
                );
            case 'server_error':
                return HttpResponse.json(
                    { message: '伺服器錯誤，請稍後再試' },
                    { status: 500 }
                );
            case 'success':
            default:
                return HttpResponse.json({
                    username: 'dean',
                    role: userRole,
                });
        }
    }),

    // GET /api/products
    http.get('/api/products', async ({ request }) => {
        await delay(getDelay());

        const { authorized } = checkAuth(request);
        if (!authorized) {
            return HttpResponse.json(
                { message: '未授權，請重新登入' },
                { status: 401 }
            );
        }

        const scenario = getScenario<ProductsScenario>(SCENARIO_KEYS.products, 'success');

        switch (scenario) {
            case 'server_error':
                return HttpResponse.json(
                    { message: '伺服器錯誤，請稍後再試' },
                    { status: 500 }
                );
            case 'success':
            default:
                return HttpResponse.json({
                    products: mockProducts,
                });
        }
    }),
];

export { SCENARIO_KEYS };
