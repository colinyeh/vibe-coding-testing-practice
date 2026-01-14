import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// GitHub Pages SPA 重導向處理
const handleGitHubPagesRedirect = () => {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  if (redirect) {
    // 清除 query string 並導向到正確路徑
    window.history.replaceState(null, '', redirect);
  }
};
handleGitHubPagesRedirect();

async function enableMocking() {
  // 如果有設定 API URL，就不使用 MSW（真實 API 模式）
  if (import.meta.env.VITE_API_URL) {
    // 自動移除之前註冊的 MSW Service Worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        if (registration.active?.scriptURL.includes('mockServiceWorker')) {
          await registration.unregister();
          console.log('[MSW] Service Worker 已自動移除（切換至真實 API 模式）');
        }
      }
    }
    return;
  }

  const { worker } = await import('./mocks/browser');

  return worker.start({
    onUnhandledRequest(request, print) {
      // 只對 /api 請求發出警告，其他靜默略過
      if (request.url.includes('/api/')) {
        print.warning();
      }
    },
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
