'use client'
import styles from './index.module.scss'
import { Modal, Button } from "antd"
import CardLogin from "../../card/auth/login"
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'

interface Props {
	open: boolean,
	changeOpen: Function,
}

const LoginModal = ({open, changeOpen }: Props) => {
	const router = useRouter();
	const t = useTranslations();

	const handleLogin = () => {
		changeOpen(false)
	}

	return (
		<Modal 
			open={open}
			centered
			onCancel={() => changeOpen(false)}
			footer={false}
			maskClosable={false}
			width={320}
		>
			<CardLogin emitFunction={handleLogin}></CardLogin>
			<div className={styles['modal-login']}>
				<span>
					{
						t.rich(
							'DontHaveAccount', 
							{
								element: (children) => 
								(<Button
									onClick={() => {
										changeOpen(false);
										router.push('/auth?authType=signup');
									}}
									type='link' size='small'
								>
									{children}
								</Button>)
							}
						)  
					}
				</span>
			</div>
		</Modal>
	)
}

export default LoginModal;