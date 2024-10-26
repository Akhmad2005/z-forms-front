'use client'

import { Row, Col, Table, TableProps, message, Popconfirm, Button, Space, Menu } from "antd"
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { useRouter, usePathname } from '@/i18n/routing'
import { fetchClient } from '@/utilities/functions/fetchClient'
import { useCookies } from 'next-client-cookies'
import { parseJwt } from "@/utilities/functions/jwtParser"
import { ItemType, MenuItemType } from 'antd/es/menu/interface'


const App = () => {
	const cookies = useCookies();
	const parsedToken = parseJwt(cookies.get('auth-token')!)
	const router = useRouter();
	const pathname = usePathname();
	const [mounted, setMounted] = useState<boolean>(false)
	const t = useTranslations();
	const [loading, setLoading] = useState<boolean>(false)
	const [data, setData] = useState<FormListItem[]>([])

	const columns: TableProps['columns'] = [
		{
			title: t('creator'),
			dataIndex: 'user',
			key: 'user',
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
					text: t('AllForms'),
					value: 'all',
				},
				{
					text: t('MyForms'),
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
			title: t('TemplateTitle'),
			dataIndex: 'templateTitle',
			key: 'templateTitle',
		},
		{
			title: t('CreatedDate'),
			dataIndex: 'createdDate',
			key: 'createdDate',
		},
		{
			title: t('question', {count: 'other'}),
			dataIndex: 'onTableVisibleQuestions',
			key: 'onTableVisibleQuestions',
			width: 600,
			render: (questions: FormListQuestion[]) => (
				<div>
					{questions.map((question) => (
						<div className="table-question-answer" key={question._id}>
							<strong>{question.title}:</strong> {question.answer}
						</div>
					))}
				</div>
			),
		},
		{
			title: '',
			render: (text: string, record) => (
        <div>
					<Space>
						<Button 
							onClick={() => router.push(pathname + `/${record._id}?templateId=${record.templateId}`)} 
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
        endpoint: `/forms/${_id}`,
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
			const data: FormListItem[] = await fetchClient({
				endpoint: '/forms',
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
								t('menu.Forms')
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