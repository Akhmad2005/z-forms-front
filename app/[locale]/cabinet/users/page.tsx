'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Row, Col, Button, Table, TableProps, Tag, message, Dropdown, Select, Space, Popconfirm } from 'antd'
import { DeleteFilled } from '@ant-design/icons'
import { useRouter, usePathname } from '@/i18n/routing'
import { fetchClient } from '@/utilities/functions/fetchClient'
import { useCookies } from 'next-client-cookies'
import { RoleEnum } from '@/utilities/enums/role'

type ActionType = 'block' | 'unblock' | 'delete' | 'makeAdmin' | 'removeAdmin'

const App = () => {
	const cookies = useCookies();
	const router = useRouter();
	const pathname = usePathname();
	const [mounted, setMounted] = useState<boolean>(false)
	const t = useTranslations();
	const [loading, setLoading] = useState<boolean>(false)
	const [data, setData] = useState([])

	const columns: TableProps['columns'] = [
		{
			title: t('name'),
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: t('email'),
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: t('RegistrationDate'),
			key: 'registrationDate',
			dataIndex: 'registrationDate',
		},
		{
			title: t('LastLoginDate'),
			key: 'lastLoginDate',
			dataIndex: 'lastLoginDate',
		},
		{
			title: t('role'),
			key: 'role',
			dataIndex: 'role',
			render: (text: RoleEnum, record) => (
        <Select 
					showSearch={false}
					style={{width: '100%'}}
					onChange={(value: RoleEnum) => handleChangeRole(record._id, value)}
					defaultValue={text} 
					options={[
						{label: t('admin'), value: RoleEnum.admin},
						{label: t('user'), value: RoleEnum.user},
					]}
				>
				</Select> 
			)	
		},
		{
			title: t('status'),
			dataIndex:'status',
			key:'status',
			render: (text: string, record) => (
				<div 
				style={{
					display: 'flex',
					justifyContent: 'center',
				}}
				>
					<Dropdown
						placement="bottom" 
						overlayStyle={{
							padding: 0
						}}
						menu={{
							items: [{
								key: '1',
                label: 
									<Tag 
										style={{marginInlineEnd: 0, width: '100%', textAlign: 'center'}} 
										color={text != 'active' ? 'green' : 'red'}
									>
										{t(text == 'active' ? 'block' : 'activate')}
									</Tag>,
								style: {padding: 0},
								onClick: () => handleChangeUserProp(text == 'active' ? 'block' : 'unblock', record._id)
							}]
						}}
					>
						<Tag className='link' color={text == 'active' ? 'green' : 'red'}>
							{t(text)}
						</Tag>
					</Dropdown>
				</div>
			)
		},
		{
			key: 'actions',
			render: (text: string, record) => (
        <div>
					<Space>
						<Popconfirm 
							onConfirm={() => handleChangeUserProp('delete', record._id)} 
							placement='left' 
							title={t('ConfirmTheAction')}
							description={t('InformationDeleteUser')}
						>
							<Button type='primary' icon={<DeleteFilled/>} danger />
						</Popconfirm>
					</Space>
				</div> 
			),
			fixed: 'right'
		}
	];

	const handleChangeUserProp = async (a: ActionType, userId: number) => {
		try {
			const response = await fetchClient(
				{
					endpoint: `/users/${a}`,
					options: {
						method: 'POST',
						body: JSON.stringify({
							userId,
						}),
					},
					router,
					cookies,
				}
			); 
			
		} catch (error: any) {
			message.error(t('fetchError.changeData'));
			console.error(error);
		} finally {
			fetchData();
			setLoading(false);
		}
	}

	const handleChangeRole = async (userId: number, role: RoleEnum) => {
		try {
			await fetchClient(
				{
					endpoint: `/users/edit`,
					options: {
						method: 'PATCH',
						body: JSON.stringify({
							userId,
							form: {
								role: role
							}
						}),
					},
					cookies,
					router,
				}
			); 
			
		} catch (error: any) {
			message.error(t('fetchError.changeData'));
			console.error(error);
		} finally {
			fetchData();
			setLoading(false);
		}
	}

	const fetchData = async () => {
		setLoading(true);
		try {
			const data = await fetchClient({
				endpoint: '/users',
				cookies: cookies,
				router: router,
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
		setMounted(true);
  }, [])

	return (
		<div className={'dashbord_page'}>
			<header className={'dashbord_page-header'}>
				<Row gutter={[12, 12]} align={'middle'}>
					<Col>
						<h3>
							{
								t('menu.Users')
							}
						</h3>
					</Col>
					<Col flex={1}></Col>
				</Row>
			</header>
			<main className={'dashbord_page-main'}>
				
				<Table 
					loading={loading}
					scroll={{
						x: 'max-content',
					}}
					key={'_id'}
					rootClassName='custom-ant-table'
					columns={columns}
					dataSource={data}
					pagination={{
						position: ['bottomCenter']
					}}
					bordered={true}
				></Table>
			</main>
		</div>
	)
}

export default App;