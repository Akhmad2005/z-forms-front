'use client'

import styles from './index.module.scss'
import { Form, Button, Input, Row, Col, message, Popconfirm, Space } from "antd";
import {LinkOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons'
import { useTranslations } from "next-intl";
import { fetchClient } from '@/utilities/functions/fetchClient';
import { useCookies } from 'next-client-cookies';
import { useRouter } from '@/i18n/routing';
import { useEffect, useState } from 'react';

interface Props {
  accountId?: string;
	onChange?: Function
}

const FormSalesforceIntegration = ({accountId, onChange}: Props) => {
	const t = useTranslations();
	const cookies = useCookies();
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);

	const [salesforceForm] = Form.useForm();

	const createSalesforceContact = async (form: any) => {
		setLoading(true);
		try {
			let data = await fetchClient({
				endpoint: '/salesforce/contact/',
				options: {
					method: 'POST',
					body: JSON.stringify(form),
					headers: {
						'salesforce-token': cookies.get('salesforce-token') || '',
						'salesforce-instance_url': cookies.get('salesforce-instance_url') || '',
					}
				},
				cookies,
				router,
				salesforceMiddleware: true
			}) 
			if (onChange) {
				onChange();
			}
			message.success(t('fetchSuccess.createdData'))
		} catch (error) {
			message.error(t('fetchError.createData'))
			console.error(`Error creating salesforce contact: ${error}`);
		} finally{
			setLoading(false);
		}
	}

	const editSalesforceContact = async (form: any) => {
		setLoading(true);
		try {
			let data = await fetchClient({
				endpoint: `/salesforce/contact/${accountId}`,
				options: {
					method: 'PATCH',
					body: JSON.stringify(form),
					headers: {
						'salesforce-token': cookies.get('salesforce-token') || '',
						'salesforce-instance_url': cookies.get('salesforce-instance_url') || '',
					}
				},
				cookies,
				router,
				salesforceMiddleware: true
			}) 
			if (onChange) {
				onChange();
			}
			message.success(t('fetchSuccess.editedData'))
		} catch (error) {
			message.error(t('fetchError.changeData'))
			console.error(`Error editing salesforce contact: ${error}`);
		} finally {
			setLoading(false);
		}
	}

	const deleteSalesforceContact = async () => {
		setLoading(true);
		try {
			let data = await fetchClient({
				endpoint: `/salesforce/contact/${accountId}`,
				options: {
					method: 'DELETE',
					headers: {
						'salesforce-token': cookies.get('salesforce-token') || '',
						'salesforce-instance_url': cookies.get('salesforce-instance_url') || '',
					}
				},
				cookies,
				router,
				salesforceMiddleware: true
			}) 
			if (onChange) {
				onChange();
			}
			salesforceForm.resetFields();
			message.success(t('fetchSuccess.deletedData'))
		} catch (error) {
			message.error(t('fetchError.deleteData'))
			console.error(`Error editing salesforce contact: ${error}`);
		} finally {
			setLoading(false);
		}
	}

	const fetchDetail = async () => {
		setLoading(true);
		try {
			let data = await fetchClient({
				endpoint: `/salesforce/contact/${accountId}`,
				options: {
					headers: {
						'salesforce-token': cookies.get('salesforce-token') || '',
						'salesforce-instance_url': cookies.get('salesforce-instance_url') || '',
					}
				},
				cookies,
				router,
				salesforceMiddleware: true
			}) 
			salesforceForm.setFieldsValue(data)
		} catch (error) {
			console.error(`Error fetching salesforce contact detail: ${error}`);
		} finally {
			setLoading(false);
		}
	}
	
	const onFinishSalesforceForm = () => {
		let form = salesforceForm.getFieldsValue();
		if (accountId) {
			editSalesforceContact(form)
		} else {
			createSalesforceContact(form)
		}
	}

	useEffect(() => {
		if (accountId) {
			fetchDetail();
		}
	}, [accountId])

	return (
		<Form 
			disabled={loading}
			form={salesforceForm} 
			onFinish={onFinishSalesforceForm} 
			className={styles.form} 
			layout="vertical"
		>
			<Form.Item 
				name={'FirstName'} 
				label={t('firstName')} 
				rules={[
					{required: true}
				]}
			>
				<Input placeholder={t('firstName')}/>
			</Form.Item>
			<Form.Item 
				name={'LastName'} 
				label={t('lastName')} 
				rules={[
					{required: true}
				]}
			>
				<Input placeholder={t('lastName')}/>
			</Form.Item>
			<Form.Item 
				name={'Email'} 
				label={t('email')} 
				rules={[
					{required: true, type: 'email'}
				]}
			>
				<Input placeholder={t('email')}/>
			</Form.Item>
			<Form.Item >
				<Row>
					<Col flex={1}></Col>
					<Col>
						<Space>
							<Button 
								loading={loading} 
								iconPosition='end' 
								icon={accountId ? <EditOutlined/> : <LinkOutlined/>} 
								htmlType='submit' 
								type='primary'
							>
								{
									accountId ?
									t('edit')
									:
									t('connect')
								}
							</Button>
							{
								accountId && (
                  <Popconfirm 
										onConfirm={deleteSalesforceContact}
										title={t('ConfirmTheAction')} 
										description={t('DeleteAccountFromSalesforce')}
									>
										<Button loading={loading} type="primary" danger icon={<DeleteOutlined/>} />
									</Popconfirm>
                )
							}
						</Space>
					</Col>
				</Row>
			</Form.Item>
		</Form>
	)
}

export default FormSalesforceIntegration;