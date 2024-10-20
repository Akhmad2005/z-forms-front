'use client'

import { Row, Col, Table, Button, TableProps, Menu, message } from "antd";
import { EyeFilled } from '@ant-design/icons'
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import { parseJwt } from "@/utilities/functions/jwtParser";
import { useRouter, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { fetchClient } from "@/utilities/functions/fetchClient";


const App = () => {
	const params = useParams();
	const t = useTranslations();
	const cookies = useCookies();
	const parsedToken = parseJwt(cookies.get('auth-token')!)
	const router = useRouter();
	const pathname = usePathname();
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState();
	const {_templateId} = params;

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
			title: '',
			render: (text: string, record) => (
        <div>
					<Button 
						onClick={() => router.push(pathname + `/${record._id}?templateId=${record.templateId}`)} 
						type='primary' 
						icon={<EyeFilled/>} 
					/>
				</div> 
			),
			width: '1%',
			fixed: 'right',
		}
	]

	const fetchData = async () => {
		setLoading(true);
		try {
			const data = await fetchClient({
				endpoint: `/templates/${_templateId}/forms`,
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
				</Row>
			</header>
			<main className={'dashbord_page-main'}>
				<Table 
					loading={loading}
					rootClassName='custom-ant-table'
					columns={columns}
					dataSource={data}
					rowHoverable={true}
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