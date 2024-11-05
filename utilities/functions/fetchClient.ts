import { Cookies } from 'next-client-cookies';
import { RouterIntl } from '../interfaces/router';
import { exitFromAccount } from './account';
import { message } from 'antd';

import { connectToSalesforce } from '@/utilities/functions/salesforce';

interface Props {
  cookies: Cookies
  endpoint: string
  options?: RequestInit
  withToken?: boolean
  router: RouterIntl
  salesforceMiddleware?: boolean
}

export const fetchClient = async ({cookies, endpoint, options = {}, withToken = true, router, salesforceMiddleware}: Props) => {
	const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try { 
    const token = cookies.get('auth-token');
    const locale = cookies.get('NEXT_LOCALE');

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Accept-Language': locale || 'en',
        'Content-Type': 'application/json',
        Authorization: withToken && token ? `Beare ${token}` : '',
        ...(options.headers || {}),
      },
    });

    const data = await response.json();

    if (salesforceMiddleware) {
      if (data.errorCode == 'INVALID_SESSION_ID' || data.errorCode == 'TOKEN_NOT_FOUND' ||  data.errorCode == 'INSTANCE_URL_NOT_FOUND') {
        connectToSalesforce({cookies, router})
      }
    }

    if (response.status == 401 ) {
      exitFromAccount(cookies, router)
    }

    if (!response.ok) {
      throw new Error(`${data?.message || data?.error || 'Undefined error'}:${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};