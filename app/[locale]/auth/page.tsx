'use client'

import { useEffect, useState } from 'react';
import styles from './page.module.scss'
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import CardLogin from '@/app/components/card/auth/login';
import CardSignUp from '@/app/components/card/auth/signup';
import { AuthType } from '@/utilities/types/auth';
import { useCookies } from 'next-client-cookies';
import { Link } from '@/i18n/routing';
import { useRouter, usePathname } from '@/i18n/routing';
import {  useSearchParams } from 'next/navigation';
import {HomeFilled} from '@ant-design/icons'

const App = () => {
	const cookies = useCookies();
	const token = cookies.get('auth-token');
	const [mounted, setMounted] = useState<boolean>(false)
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
	const t = useTranslations();
	const router = useRouter(); 
	const pathname = usePathname(); 
	const [authType, setAuthType] = useState<AuthType>(params.get('authType') as 'login' | 'signup');

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		params.set('authType', authType);
		router.replace(`${pathname}?${params.toString()}`)
	}, [authType])

	return (
		<div className={styles['page']}>
			<div className={`container ${styles['page-container']}`}>
				<div className={styles['page-wrapper']}>
						{
							token 
							?
								<div className={`${styles['page-card']} ${styles['page-card-question']}`}>
									<h1>
										{`${t('YouAlreadyLoggedIn')}!`}
									</h1>
									<br />
									<Link href={'/'}>
										<Button icon={<HomeFilled/>} >
											{t('GoHome')}
										</Button>
									</Link>
								</div>
							:
							<div className={styles['page-cards-wrapper']}>
								<>
									<div className={styles['page-card']}>
										{
											authType == 'login' ?
											<CardLogin></CardLogin>
											: <CardSignUp></CardSignUp>
										}
									</div>
									<div className={`${styles['page-card']} ${styles['page-card-question']}`}>
										<small>
											{
												authType == 'login' ?
												t.rich(
													'DontHaveAccount', 
													{
														element: (children) => 
														(<Button
															onClick={() => setAuthType('signup')} 
															type='link' size='small'
														>
															{children}
														</Button>)
													}
												) : 
												t.rich(
													'HaveAccount', 
													{
														element: (children) => 
															(
																<Button
																	onClick={() => setAuthType('login')} 
																	type='link' size='small'
																>
																	{children}
																</Button>
															)
													}
												)
											}
										</small>
									</div>
								</>
							</div>
						}
				</div>
			</div>
		</div>
	)
}

export default App;