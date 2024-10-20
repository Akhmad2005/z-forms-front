import { Cookies } from "next-client-cookies";
import { RouterIntl } from "../interfaces/router";
export function exitFromAccount(cookies: Cookies, router: RouterIntl) {
	cookies.remove('auth-token')
	router.push('/')
}