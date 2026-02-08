import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginPage } from './LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SCENARIO_KEYS } from '../mocks/handlers';
import { TOKEN_KEY } from '../api/axiosInstance';

const renderLoginPage = (initialEntries = ['/login']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<div>Dashboard Page</div>} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
};

describe('LoginPage', () => {
    describe('前端元素', () => {
        it('介面應包含 Email、密碼輸入框及登入按鈕', () => {
            renderLoginPage();
            expect(screen.getByText('歡迎回來')).toBeInTheDocument();
            expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
            expect(screen.getByLabelText('密碼')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '登入' })).toBeInTheDocument();
        });

        it('顯示登入過期訊息', async () => {
            renderLoginPage();

            // 模擬觸發 auth:unauthorized 事件
            const event = new CustomEvent('auth:unauthorized', {
                detail: '登入已過期'
            });
            window.dispatchEvent(event);

            await waitFor(() => {
                expect(screen.getByText('登入已過期')).toBeInTheDocument();
            });
        });
    });

    describe('function 邏輯', () => {
        it('Email 格式驗證', async () => {
            renderLoginPage();
            const emailInput = screen.getByLabelText('電子郵件');
            const submitButton = screen.getByRole('button', { name: '登入' });

            fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
            fireEvent.click(submitButton);

            expect(await screen.findByText('請輸入有效的 Email 格式')).toBeInTheDocument();
        });

        it('密碼長度驗證', async () => {
            renderLoginPage();
            const emailInput = screen.getByLabelText('電子郵件');
            const passwordInput = screen.getByLabelText('密碼');
            const submitButton = screen.getByRole('button', { name: '登入' });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'abc12' } });
            fireEvent.click(submitButton);

            expect(await screen.findByText('密碼必須至少 8 個字元')).toBeInTheDocument();
        });

        it('密碼英數混和驗證', async () => {
            renderLoginPage();
            const emailInput = screen.getByLabelText('電子郵件');
            const passwordInput = screen.getByLabelText('密碼');
            const submitButton = screen.getByRole('button', { name: '登入' });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: '12345678' } });
            fireEvent.click(submitButton);

            expect(await screen.findByText('密碼必須包含英文字母和數字')).toBeInTheDocument();
        });
    });

    describe('Mock API', () => {
        it('登入成功跳轉', async () => {
            renderLoginPage();
            const emailInput = screen.getByLabelText('電子郵件');
            const passwordInput = screen.getByLabelText('密碼');
            const submitButton = screen.getByRole('button', { name: '登入' });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Password123' } });
            fireEvent.click(submitButton);

            // 等待跳轉到 Dashboard
            await waitFor(() => {
                expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
            });

            // 檢查 Token 是否存入 LocalStorage
            expect(localStorage.getItem(TOKEN_KEY)).toBe('fake.jwt.token');
        });

        it('登入失敗處理 (帳號不存在)', async () => {
            // 設定 MSW 情境
            localStorage.setItem(SCENARIO_KEYS.login, 'email_not_found');

            renderLoginPage();
            const emailInput = screen.getByLabelText('電子郵件');
            const passwordInput = screen.getByLabelText('密碼');
            const submitButton = screen.getByRole('button', { name: '登入' });

            fireEvent.change(emailInput, { target: { value: 'nofound@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'Password123' } });
            fireEvent.click(submitButton);

            expect(await screen.findByText('帳號不存在')).toBeInTheDocument();
        });

        it('登入失敗處理 (密碼錯誤)', async () => {
            // 設定 MSW 情境
            localStorage.setItem(SCENARIO_KEYS.login, 'invalid_password');

            renderLoginPage();
            const emailInput = screen.getByLabelText('電子郵件');
            const passwordInput = screen.getByLabelText('密碼');
            const submitButton = screen.getByRole('button', { name: '登入' });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'WrongPass123' } });
            fireEvent.click(submitButton);

            expect(await screen.findByText('密碼錯誤')).toBeInTheDocument();
        });
    });

    describe('驗證權限', () => {
        it('已登入自動跳轉', async () => {
            // 模擬已登入
            localStorage.setItem(TOKEN_KEY, 'valid-token');

            renderLoginPage();

            await waitFor(() => {
                expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
            });
        });
    });
});
