import { RoleEnum } from "../enums/role";

export interface User {
	name: string;
	email: string;
	lastLoginDate: string;
	registrationDate: string;
	role: RoleEnum;
	status: UserStatus
	_id: string;
	salesforceAccountId: string;
}

type UserStatus = 'active' | 'blocked'