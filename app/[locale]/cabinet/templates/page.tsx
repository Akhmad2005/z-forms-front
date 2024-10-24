'use client'

import { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { useTranslations } from 'next-intl'
import { Row, Col, Button, Table, TableProps, message, Space, Tag, Popconfirm, Menu, Tooltip  } from 'antd'
import { PlusOutlined, DeleteFilled, EditFilled, EyeFilled, FileDoneOutlined } from '@ant-design/icons'
import { useRouter, usePathname } from '@/i18n/routing'
import { fetchClient } from '@/utilities/functions/fetchClient'
import { useCookies } from 'next-client-cookies'
import { Tag as TemplateTag } from '@/utilities/interfaces/tag'
import { parseJwt } from '@/utilities/functions/jwtParser'
import { ItemType, MenuItemType } from 'antd/es/menu/interface'

const App = () => {
	const cookies = useCookies();
	const router = useRouter();
	const parsedToken = parseJwt(cookies.get('auth-token')!)
	const pathname = usePathname();
	const [mounted, setMounted] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)
	const [data, setData] = useState()
	const t = useTranslations();
	const columns: TableProps['columns'] = [
		{
			title: t('title'),
			key: 'title',
			dataIndex: 'title',
		},
		{
			title: t('creator'),
			dataIndex: 'user',
			filterMultiple: false,
			filterDropdown: (props) => (
				<Menu 
					defaultSelectedKeys={['all']}
					onSelect={(info) => {
						const selectedValue = info.key;
						props.setSelectedKeys([selectedValue]);
						props.confirm({ closeDropdown: true });
					}} 
					items={props.filters?.map((f):ItemType<MenuItemType> => ({
						label: f.text,
						key: f.value as string,
					}))}
				/>
			),
			filters: parsedToken.role == 'admin' ? [
				{
					text: t('AllTemplates'),
					value: 'all',
				},
				{
					text: t('MyTemplates'),
					value: 'mine',
				},
			] : undefined,
			onFilter: (value, record) => {
				if (value == 'all') {
					return true;				
				} else if (value == 'mine') {
					if (parsedToken?._id && record?.userId && parsedToken._id == record.userId) {
						return true;
					} else {
						return false;
					}
				} else {
					return true
				}
			},
		},
		{
			title: t('TemplateTopic'),
			key: 'topic',
			dataIndex: 'topic',
		},
		{
			title: t('TemplateTags'),
			key: 'tags',
			dataIndex: 'tags',
			render: (value) => (
				<div>
					<Space>
						{
							value?.map((tag: TemplateTag) => (
                <Tag  key={tag._id}>
                  {tag.name}
                </Tag>
              ))
						}
					</Space>
				</div>
			)
		},
		{
			title: t('AccessControl'),
			key: 'accessControl',
			dataIndex: 'accessControl',
			render: (value) => (
				<div>
					{t(value)}
				</div>
			)
		},
		{
			title: '',
			render: (text: string, record) => (
        <div>
					<Space>
						<Tooltip title={t('menu.Forms')}>
							<Button 
								onClick={() => router.push(`${pathname}/${record._id}/forms`)} 
								type='primary' 
								icon={<FileDoneOutlined/>}
							/>
						</Tooltip>
						<Button 
							onClick={() => router.push(`/forms/create?templateId=${record._id}`)} 
							type='primary' 
							icon={<EyeFilled/>}
						/>
						<Button 
							onClick={() => router.push(`${pathname}/${record._id}`)} 
							type='primary' 
							icon={<EditFilled/>} 
						/>
						<Popconfirm 
							onConfirm={() => deleteData(record._id)} 
							placement='left' 
							title={t('ConfirmTheAction')}
						>
							<Button type='primary' icon={<DeleteFilled/>} danger />
						</Popconfirm>
					</Space>
				</div> 
			),
			width: '1%',
			fixed: 'right',
		}
	]

	const deleteData = async (_id: string) => {
		try {
      await fetchClient({
        endpoint: `/templates/${_id}`,
        options: {
					method: 'DELETE',
				},
        cookies: cookies,
				router,
      }); 
      await fetchData();
    } catch (error: any) {
      console.error(error);
    }
	}

	const fetchData = async () => {
		setLoading(true);
		try {
			const data = await fetchClient({
				endpoint: '/templates',
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

	const handleCreate = () => {
		router.push(pathname + '/create')
	}

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
								t('menu.Templates')
							}
						</h3>
					</Col>
					<Col flex={1}></Col>
					<Col>
						<Button onClick={handleCreate} icon={< PlusOutlined />} type='primary'>
							<span>
								{
									t('create')
								}
							</span>
						</Button>
					</Col>
				</Row>
			</header>
			<main className={'dashbord_page-main'}>
				<Table 
					scroll={{
						x: 'max-content'
					}}
					loading={loading}
					rootClassName='custom-ant-table'
					columns={columns}
					dataSource={data}
					rowHoverable={true}
					pagination={{
						position: ['bottomCenter'],
						hideOnSinglePage: true
					}}
					bordered={true}
				></Table>
			</main>
		</div>
	)
}

export default App;