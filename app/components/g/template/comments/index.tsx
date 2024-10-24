'use client'

import { useTranslations } from 'next-intl'
import styles from './index.module.scss'
import { List, Avatar, Input, Button, Form, Row, Col, Space, message } from 'antd'
import {DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, SendOutlined} from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'
import { TemplateReaction, TemplateComment } from '@/utilities/interfaces/template'
import { useCookies } from 'next-client-cookies'
import { useRouter } from '@/i18n/routing'
import { fetchClient } from '@/utilities/functions/fetchClient'
import { parseJwt } from '@/utilities/functions/jwtParser'
import LoginModal from '@/app/components/modal/login'

interface Props {
	templateId: string;
}

const TemplateComments = ({templateId}: Props) => {
	const cookies = useCookies();
	const parsedToken = parseJwt(cookies.get('auth-token'));
	const router = useRouter();
	const t = useTranslations();
	const [loading, setLoading] = useState<boolean>(false);
	const [reactionData, setReactionData] = useState<TemplateReaction>();
	const [commentsData, setCommentsData] = useState<TemplateComment[]>();
	const [loginModalOpened, setLoginModalOpened] = useState<boolean>(false);
	const [form] = Form.useForm();
	
	const handleClickReaction = async (reaction: Exclude<TemplateReaction['reaction'], null> ) => {
		if (!parsedToken) {
			setLoginModalOpened(true);			
		} else {
			setLoading(true);
			try {
				let data = await fetchClient({
					endpoint: `/template-reactions/${templateId}`,
					options: {
						method: 'PATCH',
						body: JSON.stringify({
							reaction: reaction
						}),
					},
					cookies,
					router,
				})		
				setReactionData(data);	
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		}
	}

	const handleFormFinish = ({content}: {content: string}) => {
		submitComment(content);
	}

	const submitComment = async (content: string) => {
		setLoading(true);
		try {
			let data = await fetchClient({
				endpoint: `/template-comments/create`,
				options: {
					method: 'POST',
					body: JSON.stringify({
						templateId,
						content,
					}),
				},
				cookies,
				router,
			})		
			form.resetFields();
			message.success(t('fetchSuccess.createdData'))
			fetchComments();
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}
		
	const fetchReaction = async () => {
		setLoading(true);
		try {
			let data = await fetchClient({
				endpoint: `/template-reactions/${templateId}`,
				cookies,
				router,
			});
			setReactionData(data);
		} catch (error) {
			console.error(`Error in fetching reaction: ${error}`);
		} finally{
			setLoading(false);
		}
	}

	const fetchComments = async () => {
		setLoading(true);
		try {
			let data = await fetchClient({
				endpoint: `/template-comments/${templateId}`,
				cookies,
				router,
			});
			setCommentsData(data);
		} catch (error) {
			console.error(`Error in fetching comments: ${error}`);
		} finally{
			setLoading(false);
		}
	}

	const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayout('vertical');
      } else {
        setLayout('horizontal');
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

	useEffect(() => {
		if (parsedToken?._id) {
			fetchReaction();
		}
		fetchComments();
	}, [])

	return (
		<div className={styles['comments']}>
			<div className={styles['comments-title']}>
				<h3>
					{t('FeedbacksForTemplate')}
				</h3>
			</div>
			<div className={styles['comments-list']}>
				<List 
					loading={loading}
					pagination={{
						position: 'bottom',
						align: 'center',
						pageSize: 4,
						hideOnSinglePage: true
					}}
					itemLayout={layout}
					dataSource={commentsData}
					renderItem={(item) => (
						<List.Item 
							actions={[
								<small>{item.createdDate}</small>
							]}
							
						>
							<List.Item.Meta 
								avatar={<Avatar icon={item?.user?.[0] || 'A'}/>}
								title={item.user}
								description={item.content}
							/>
						</List.Item>
					)}
				/>
			</div>
			<div className={styles['comments-create']}>
				<Form layout='vertical' form={form} onFinish={handleFormFinish}>
					<Form.Item label={t('feedback', {count: 1})} name='content' rules={[{required: true}]}>
						<Input.TextArea 
							disabled={!parsedToken?._id} 
							rows={4} 
							placeholder={t(parsedToken?._id ? 'LeaveFeedback' : 'LoginToLeaveFeedback')}
						/>
					</Form.Item>
					<Form.Item>
						<Row gutter={[12, 12]}>
							<Col>
								<Space>
									<Button 
										type="primary" 
										icon={reactionData?.reaction == 'dislike' ? <DislikeFilled/> : <DislikeOutlined/>} 
										loading={loading}
										onClick={() => handleClickReaction('dislike')}
										/>
									<Button 
										type='primary' 
										icon={reactionData?.reaction == 'like' ? <LikeFilled/> : <LikeOutlined/>}
										loading={loading}
										onClick={() => handleClickReaction('like')}
									/>
								</Space>
							</Col>
							<Col flex={1}>
							</Col>
							<Col>
								{
									parsedToken?._id ?  
									<Button loading={loading} iconPosition='end' icon={<SendOutlined/>} htmlType='submit' type='primary'>
										{t('submit')}
									</Button>
									:
									<Button onClick={() => setLoginModalOpened(true)} type='primary'>
										{t('login' )}
									</Button>
								}
							</Col>
						</Row>
					</Form.Item>
				</Form>
				<LoginModal open={loginModalOpened} changeOpen={setLoginModalOpened}></LoginModal>
			</div>
		</div>
	)
}

export default TemplateComments;