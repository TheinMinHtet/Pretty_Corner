import { MMPaySDK } from 'mmpay-node-sdk';
import { getStorefrontRepository } from './repository/StorefrontRepository';

export function getMMPayConfig() {
  const appId = process.env.MMPAY_APP_ID || '';
  const publishableKey =
    process.env.NEXT_PUBLIC_MMPAY_PUBLISHABLE_KEY ||
    process.env.MMPAY_PUBLISHABLE_KEY ||
    '';
  const secretKey = process.env.MMPAY_SECRET_KEY || '';
  const apiBaseUrl =
    process.env.MMPAY_API_BASE_URL ||
    'https://api.myanmyanpay.com';

  const isConfigured = Boolean(appId && publishableKey && secretKey);

  return {
    appId,
    publishableKey,
    secretKey,
    apiBaseUrl,
    isConfigured,
  };
}

export function getServerMMPaySdk() {
  const config = getMMPayConfig();
  if (!config.isConfigured) {
    return null;
  }

  return MMPaySDK({
    appId: config.appId,
    publishableKey: config.publishableKey,
    secretKey: config.secretKey,
    apiBaseUrl: config.apiBaseUrl,
  });
}

export async function handlePaymentSuccess(orderId: string) {
  const repo = getStorefrontRepository();
  return repo.updatePaymentStatus(orderId, 'paid');
}
