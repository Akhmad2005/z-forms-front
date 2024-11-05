'use client'

import { fetchClient } from "../fetchClient";
import { Cookies } from 'next-client-cookies';
import { RouterIntl } from '../../interfaces/router';

interface Props {
  cookies: Cookies
  router: RouterIntl
}

export const connectToSalesforce = async ({cookies, router}: Props) => {
	try {
		let data = await fetchClient({
			endpoint: '/salesforce/connect',
			options: {
				method: 'POST',
			},
			cookies,
			router,
		})	
		if (data.access_token) {
			cookies.set('salesforce-token', data.access_token);		
			cookies.set('salesforce-instance_url', data.instance_url);		
		}
	} catch (error) {
		console.error(error);
	}
}