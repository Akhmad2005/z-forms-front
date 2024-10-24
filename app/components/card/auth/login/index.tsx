'use client'

import { useState } from 'react'
import styles from './index.module.scss'
import { Form, Input, Button, message, FormProps } from "antd"
import { useTranslations } from 'next-intl'
import { fetchClient } from '@/utilities/functions/fetchClient'
import { useRouter } from '@/i18n/routing' 
import { useCookies } from 'next-client-cookies'

type FieldType = {
  password?: string;
  email?: string;
};

interface Props {
	emitFunction?: Function
}

const CardLogin = ({emitFunction}: Props) => {
	const cookies = useCookies();
	const t = useTranslations();
	const router = useRouter();
	const [form] = Form.useForm<FieldType>();
	const [formLoading, setFormType] = useState<boolean>(false);

	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setFormType(true)
    try {
      const res = await fetchClient({
				endpoint: '/auth/login', 
        options: {
					method: 'post',
					body: JSON.stringify(values), 
        },
				cookies: cookies,
				router,
			}
      )
			const token = res?.token;
			if (token) {
				cookies.set('auth-token', token)
				router.refresh();
				form.resetFields();
				emitFunction && emitFunction();
			}
    } catch (error) {
      message.error(`${error}`)
    } finally {
      setFormType(false)
    }
  };
  

	return (
		<div className={styles['card']}>
			<div className={styles['card-title']}>
				<h1>
					{`${t('hello')}!`}
				</h1>
			</div>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item rules={[{required: true}, {type: 'email'}]} name='email' label={t('email')}>
					<Input placeholder={t('email')} />
				</Form.Item>
				<Form.Item rules={[{required: true}]} name='password' label={t('password')}>
					<Input.Password placeholder={t('password')} />
				</Form.Item>
				<Form.Item>
					<Button loading={formLoading} htmlType='submit' block type='primary'>
						{t('login')}
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default CardLogin