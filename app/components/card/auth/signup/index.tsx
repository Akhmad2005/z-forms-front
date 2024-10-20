'use client'

import styles from './index.module.scss'
import { Form, Input, Button, message, FormProps } from "antd"
import { useTranslations } from 'next-intl'
import { useCookies } from 'next-client-cookies'
import { fetchClient } from '@/utilities/functions/fetchClient'
import { useState } from 'react'
import { useRouter } from '@/i18n/routing'

type FieldType = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

const CardSignUp = () => {
	const router = useRouter();
	const cookies = useCookies();
	const t = useTranslations();
	const [form] = Form.useForm(); 
	const [formLoading, setFormLoading] = useState<boolean>(false);
	const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setFormLoading(true)
    let fields = values
    delete fields.confirm
    try {
      const res = await fetchClient({
				endpoint: '/auth/register',
				options: {
          method: 'post', 
					body: JSON.stringify(fields), 
        },
				cookies: cookies,
				router,
			})
			message.success('Successfully registered')
			form.resetFields();
    } catch (error) {
			message.error(`${error}`)
    } finally {
      setFormLoading(false)
    }
  };

	return (
		<div className={styles['card']}>
			<div className={styles['card-title']}>
				<h1>
					{`${t('hello')}!`}
				</h1>
			</div>
			<Form form={form} onFinish={onFinish} autoComplete="off" layout='vertical'>
				<Form.Item 
					name='name' 
					label={t('name')}
					rules={[{required: true}]}
				>
					<Input placeholder={t('name')} />
				</Form.Item>
				<Form.Item 
					name='email' 
					label={t('email')}
					rules={[
						{required: true},
						{type: 'email'}
					]}
				>
					<Input placeholder={t('email')} />
				</Form.Item>
				<Form.Item 
					name='password' 
					label={t('password')}
					rules={[{required: true}]}
				>
					<Input.Password placeholder={t('password')} />
				</Form.Item>
				<Form.Item 
					name='confirmPassword' 
					label={t('ConfirmPassword')}
					rules={[
						{required: true},
						({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('confirmPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('validation.ConfirmPassword')));
              },
            }),
					]}
				>
					<Input.Password placeholder={t('password')} />
				</Form.Item>
				<Form.Item>
					<Button block type='primary' htmlType='submit' loading={formLoading}>
						{t('signup')}
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default CardSignUp