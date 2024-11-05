
'use client'

import { Row, Col, message, Form, Input, Button, Tag, Space, Tooltip } from "antd";
import { CheckCircleFilled, LinkOutlined, CloseOutlined, DeleteOutlined, ToTopOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons'
import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { fetchClient } from "@/utilities/functions/fetchClient";
import { useRouter } from "@/i18n/routing";
import { useCookies } from "next-client-cookies";
import { User } from "@/utilities/interfaces/users";
import FormSalesforceIntegration from "@/app/components/form/salesforce";

const App = () => {
	const t = useTranslations(); 
	const router = useRouter();
	const cookies = useCookies();
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<User>()
	const [salesforceFormVisible, setSalesforceVisible] = useState<boolean>(false)

	const salesforceToken = cookies.get('salesforce-token')
	
	const role = useMemo(() => {
		if (data?.role) {
			return t(data?.role)
		} else {
			return ''
		}
	}, [data?.role])
	
	const fetchData = async () => {
		setLoading(true);
		try {
			const data = await fetchClient({
				endpoint: '/users/me',
				cookies: cookies,
				router
			}); 
			setData(data);
		} catch (error: any) {
			console.error(error);
			message.error(t('fetchError.fetchData'));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
  }, [])

	return (
		<div className={'dashbord_page'}>
			<header className={'dashbord_page-header'}>
				<Row gutter={[12, 12]} align={'middle'}>
					<Col>
						<h3>
							{
								t('profile')
							}
						</h3>
					</Col>
					<Col flex={1}></Col>
				</Row>
			</header>
			<main className={'dashbord_page-main dashbord_page-main-padding'}>
				<div className={'dashbord_page-main-item'}>
					<div className="dashbord_page-main-item-header">
						<h3>
							{t('BasicInformation')}
						</h3>
					</div>
					<Form layout="vertical">
						<Form.Item label={t('name')}>
							<Input readOnly value={data?.name}></Input>
						</Form.Item>
						<Form.Item label={t('email')}>
							<Input readOnly value={data?.email}></Input>
						</Form.Item>
						<Form.Item label={t('role')}>
							<Input readOnly value={role}></Input>
						</Form.Item>
						<Form.Item style={{marginBottom: 0}} label={t('RegistrationDate')}>
							<Input readOnly value={data?.registrationDate}></Input>
						</Form.Item>
					</Form>
				</div>
				<div className={'dashbord_page-main-item'}>
					<div className={`dashbord_page-main-item-header ${!salesforceFormVisible ? 'no-margin' : ''}`}>
						<Row align={"middle"} gutter={[12, 12]}>
							<Col>
								<h3>
									{
										t.rich(
											'ConnectAccountToSalesForce', 
											{
												element: (children) => ( 
													<a target="_blank" href="https://salesforce.com">
														<u>
															{children}
														</u>
													</a>
												)
											}
										)
									}
								</h3>
							</Col>
							<Col flex={1}></Col>
							<Col>
								{
									data?.salesforceAccountId &&
									<Tag>
										<Space size={4}>
											{t('connected')}
											<CheckCircleFilled/>
										</Space>
									</Tag>
								}
							</Col>
							<Col>
								{
									<Button 
										size="small" 
										type="primary" 
										icon={salesforceFormVisible ? <ToTopOutlined/> : <VerticalAlignBottomOutlined/>}
										onClick={() => {
											setSalesforceVisible(!salesforceFormVisible);
										}}
									/>	
								}
							</Col>
						</Row>
					</div>
					{
						salesforceToken &&
						<main style={{
							display: salesforceFormVisible ? 'block' : 'none'
						}}>
							<Row justify={'center'}>
								<Col xl={12} md={18} xs={24}>
									<FormSalesforceIntegration 
										accountId={data?.salesforceAccountId}
										onChange={() => fetchData()}
									/>
								</Col>
							</Row>
						</main>
					}
				</div>
			</main>
		</div>
	)
}

export default App;