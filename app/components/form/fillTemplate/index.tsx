'use client'
import { useEffect, useMemo, useState } from 'react'
import styles from './index.module.scss'
import { message, Space, Tag, Form, Button, Row, Col, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons'
import { useTranslations } from 'next-intl';
import { useCookies } from 'next-client-cookies';
import { fetchClient } from '@/utilities/functions/fetchClient';
import { useParams, useSearchParams } from 'next/navigation';
import { ReadOnlyTemplateDetail, TemplateReaction } from '@/utilities/interfaces/template';
import FormQuestionCard from '@/app/components/card/form-question';
import { useRouter } from '@/i18n/routing';
import TemplateComments from '../../g/template/comments';
import SanitizedHTML from '../../g/sanitized-html';
import { parseJwt } from '@/utilities/functions/jwtParser';
import LoginModal from '@/app/components/modal/login'

interface Props {
	mode?: pageMode
	feedback?: boolean
}

const FillTemplateForm = ({mode, feedback = true}: Props) => {
	const t = useTranslations();
	const params = useParams();
	const router = useRouter();
	const {_id: formId} = params;
	const searchParams = useSearchParams();
	const templateId = searchParams.get('templateId');;
	const cookies = useCookies();
	const [loading, setLoading] = useState<boolean>(false);
	const [templateData, setTemplateData] = useState<ReadOnlyTemplateDetail>();
	const [formData, setFormData] = useState<FormDetail>();
	const [reactionData, setReactionData] = useState<TemplateReaction>();
	const [dataError, setDataError] = useState<string>()
	const [form] = Form.useForm();
	const [finished, setFinished] = useState<boolean>(false);
	const parsedToken = parseJwt(cookies.get('auth-token'))
	const [loginModalOpened, setLoginModalOpened] = useState<boolean>(false);

	const pageMode = useMemo<pageMode>(() => {
		if (mode) {
			return mode;
		}
		if (!formId)  {
			return 'create'
		}
		if (formId == 'create') {
			return 'create'
		} else {
			return 'edit'
		}
	}, [formId])

	const fetchTemplateData = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				mode: 'readonly',
				f: pageMode !== 'create' ? formId.toString() : '',
			});
			
			if (!params.get('f')) {
				params.delete('f');
			}
			let data: ReadOnlyTemplateDetail = await fetchClient({
				endpoint: `/templates/${templateId}?${params.toString()}`,
				cookies,
				router,
			})
			setTemplateData(data);
		} catch (error) {
			let status;
			if (error instanceof Error && typeof error.message === 'string') {
				const splitError = error.message.split(':');
				status = splitError.at(-1);
				if (Number(status) == 405) {
					message.error(t('fetchError.notAllowed'))
					setDataError(t('fetchError.notAllowed'))
				} else {
					message.error(t('fetchError.fetchData'))
					console.error(`Error in fetching data: ${error}`);
				}
			}
		} finally{
			setLoading(false);
		}
	} 

	const fetchFormDetail = async () => {
		setLoading(true);
		try {
			let data = await fetchClient({
				endpoint: `/forms/${formId}`,
				cookies,
				router,
			});
			setFormData(data);
			let answers = data?.answers?.forEach((e: any) => {
				form.setFieldValue(e.questionId, e.answer)
			})
		} catch (error) {
			let status;
			if (error instanceof Error && typeof error.message === 'string') {
				const splitError = error.message.split(':');
				status = splitError.at(-1);
				if (Number(status) == 405) {
					message.error(t('fetchError.notAllowed'))
					setDataError(t('fetchError.notAllowed'))
				} else {
					message.error(t('fetchError.fetchData'))
					console.error(`Error in fetching data: ${error}`);
				}
			}
		} finally{
			setLoading(false);
		}
	}

	interface Answer {
		questionId: string, answer: string
	}

	interface SubmitForm {
		templateId: string;
		answers: Answer[];
	}

	const updateForm = async(form: SubmitForm) => {
		setLoading(true);
		try {
			await fetchClient({
				endpoint: `/forms/${formId}`,
        options: {
					method: 'PATCH',
					body: JSON.stringify({form}),
				},
        cookies,
				router,
			});
			message.success(t('fetchSuccess.editedData'))			
			router.push('/cabinet/forms')
		} catch (error) {
			message.error(t('fetchError.changeData'));
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	const createForm = async(form: SubmitForm) => {
		setLoading(true);
		try {
			await fetchClient({
				endpoint: '/forms/create',
        options: {
					method: 'POST',
					body: JSON.stringify({form}),
				},
        cookies,
				router,
			})			
			message.success(t('fetchSuccess.createdData'));
			setFinished(true);
		} catch (error) {
			message.error(t('fetchError.createData'));	
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	const handleFinish = () => {
		let answersObject = form.getFieldsValue();
		let answers: Answer[] = []
		Object.keys(answersObject).forEach((k: string) => {
				const answer = answersObject[k];
				answers.push({
					questionId: k,
					answer,
				})
		});
	
		if (templateData?._id) {
			if (pageMode == 'create') {
				createForm({
					answers,
					templateId: templateData?._id,
				})
			} else if (pageMode == 'edit') {
				updateForm({
					answers,
					templateId: templateData?._id,
				})
			}
		}
	}

	useEffect(() => {
		if (pageMode == 'edit' || pageMode == 'readonly') {
			fetchFormDetail();
		}
		fetchTemplateData();
	}, [])

	if (dataError) {
		return (
			<div className={styles['page']}>
				<div className="container">
					<div className={styles['page-wrapper']}>
						<Row justify={'center'}>
							<Col>
								<Button >
									{dataError}
								</Button>
							</Col>
						</Row>
					</div>
				</div>
			</div>
		)
	}

	if (finished) {
		return (
			<div className={styles['page']}>
				<div className="container">
					<div className={styles['page-wrapper']}>
						<Row justify={'center'}>
							<Col>
								<Button>
									{t('fetchSuccess.createdData')}
								</Button>
							</Col>
						</Row>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={styles['page']}>
			<div className="">
				<div className={styles['page-wrapper']}>
					<div className={styles['page-header']}>
						<h3>{templateData?.title || ''}</h3>
						<SanitizedHTML htmlContent={templateData?.description}></SanitizedHTML>
						{/* <p>
							{templateData?.description || ''}
						</p> */}
						<span>
							{templateData?.topic ? `${t('topic')}: ${templateData.topic}` : ''}
						</span>
						<div>
							<Space wrap={true}>
								{
									templateData?.tags.map((tag) => (
										<Tag key={tag._id}>{tag?.name ? `#${tag.name}` : ''}</Tag>
									))
								}
							</Space>
						</div>
					</div>
					<Form onFinish={handleFinish} form={form}>
						<div className={styles['page-questions']}>
							{
								templateData?.questions.map((question, i) => (
                  <Form.Item style={{marginBottom: 16}} name={question._id} key={question._id} rules={[{required: true, message: t('RequiredField')}]}>
										<FormQuestionCard mode={pageMode} formKey={question._id as string} form={form} question={question} index={i}/>
                  </Form.Item>
                ))
							}
						</div>
						{
							templateData && templateData._id && pageMode != 'readonly' &&
							<Form.Item >
								<Row gutter={[12, 12]}>
									<Col flex={1}></Col>
										<Col>
											{
												parsedToken?._id ?
												<Button loading={loading} iconPosition='end' icon={<SendOutlined />} htmlType='submit' type='primary'>
													{t(pageMode == 'create' ? 'submit' : 'save')}
												</Button>
												:
												<Button onClick={() => setLoginModalOpened(true)} loading={loading} type='primary'>
													{t('login')}
												</Button>
											}
										</Col>
								</Row>
							</Form.Item>
						}
					</Form>
					{
						templateData && templateData._id && feedback &&
						<div className={styles['page-feedbacks']}>
							<TemplateComments templateId={templateData._id}></TemplateComments>
						</div>
					}
				</div>
			</div>
			<LoginModal open={loginModalOpened} changeOpen={setLoginModalOpened}></LoginModal>
		</div>
	)
}

export default FillTemplateForm