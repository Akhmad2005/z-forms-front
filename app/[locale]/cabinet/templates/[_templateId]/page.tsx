'use client'

import React, { useReducer, useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Form, Button, Input, Row, Select, Col, Space, Tag, Radio, Spin, FormProps, FormInstance, message } from "antd";
import {PlusOutlined, SaveOutlined, ToTopOutlined, VerticalAlignBottomOutlined} from '@ant-design/icons'
import type { Question } from "@/utilities/types/question";
import QuestionCard from "@/app/components/card/question";
import { AnswerTypeEnum } from "@/utilities/enums/answer";
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DragRow from "@/app/components/g/drag/row";
import { RowContextProps } from "@/utilities/interfaces/drag/row";
import { TemplateMainForm, TemplatePrivacyForm } from "@/utilities/interfaces/template";
import { questionsReducer } from "@/utilities/functions/reducers/questions";
import { fetchClient } from "@/utilities/functions/fetchClient";
import { useCookies } from "next-client-cookies";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Topic } from "@/utilities/interfaces/topic";
import { Tag as TemplateTag } from "@/utilities/interfaces/tag";
import { User } from "@/utilities/interfaces/users";

const RowContext = React.createContext<RowContextProps>({});

const initialQuestion: Question = {
	title: '',
	description: '',
	isVisibleInTable: false,
	answerType: AnswerTypeEnum.Input,
	_id: Math.random(),
	compacted: false,
}

const initialMainForm: TemplateMainForm = {
	description: '',
	title: '',
	tags: [],
	topicId: null,
}

const initialPrivacyForm: TemplatePrivacyForm = {
	allowedUsers: [],
	accessControl: 'public',
}

const App = () => {
	const router = useRouter();
	const params = useParams();
	const {_templateId} = params;
	const cookies = useCookies();
	const [mounted, setMounted] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [topics, setTopics] = useState<Topic[]>([]);
	const [topicsLoading, setTopicsLoading] = useState<boolean>(false);
	const [tags, setTags] = useState<TemplateTag[]>([]);
	const [tagsLoading, setTagsLoading] = useState<boolean>(false);
	const [users, setUsers] = useState<User[]>([]);
	const [usersLoading, setUsersLoading] = useState<boolean>(false);
	const [questions, questionsDispatch] = useReducer(questionsReducer, []);
	const [mainForm, setMainForm] = useState<TemplateMainForm>(initialMainForm);
	const [privacyForm, setPrivacyForm] = useState<TemplatePrivacyForm>(initialPrivacyForm);
	const [mainFormInstance] = Form.useForm();
	const [privacyFormInstance] = Form.useForm();
	const [questionsFormInstance, setQuestionsFormInstance] = useState<{ [key: string]: FormInstance<any> }>({}) 
	const t = useTranslations();
	const pageMode = useMemo<pageMode>(() => {
		if (!_templateId)  {
			return 'create'
		}
		if (_templateId == 'create') {
			return 'create'
		} else {
			return 'edit'
		}
	}, [_templateId])
	const handleQuestionsCompact = () => {
    questionsDispatch({type: 'EDIT', index: 'all', payload: { compacted: true }}) 
  };
	const handleQuestionsExpand = () => {
    questionsDispatch({type: 'EDIT', index: 'all', payload: { compacted: false }}) 
  };
	const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active?.id && over?.id && active.id !== over?.id) {
			questionsDispatch({type: 'MOVE', activeId: active.id, overId: over.id})
		}
  };

	const handleTagsKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const { key } = event;
    const isLatin = /^[A-Za-z]+$/.test(key);

    if (!isLatin && key !== 'Backspace' && key !== 'Enter') {
      event.preventDefault();
    }
	}

	const validateForms = async () => {
		try {
			const promiseMainForm = await mainFormInstance.validateFields();
			const promisePrivacyForm = await privacyFormInstance.validateFields();
			const questionFormPromises = Object.keys(questionsFormInstance).map((key) =>
				questionsFormInstance[key].validateFields()
			);
	
			await Promise.all([
				promiseMainForm,
				promisePrivacyForm,
				...questionFormPromises
			]);
		} catch (error) {
			console.error(error);
			throw new Error('Error in form validation');
		}
	};

	const prepareFormData = () => {
		const form = {
			questions: questions,
			...mainForm,
			...privacyForm,
		};
		return form;
	};
	
	const handleSubmitForm = async () => {
		try {
			setLoading(true);
			await validateForms();
			const form = prepareFormData();
			await submitFormData(form);
		} catch (error) {
			console.error("Validation error:", error);
		} finally {
			setLoading(false);
		}
	};

	const submitFormData = async (form: {questions: Question[]} & TemplateMainForm & TemplatePrivacyForm) => {
		try {
			const endpoint = pageMode === 'create' ? '/templates/create' : `/templates/${_templateId}`;
			const method = pageMode === 'create' ? 'POST' : 'PATCH';
	
			await fetchClient({
				endpoint: endpoint,
				cookies: cookies,
				options: {
					method: method,
					body: JSON.stringify({ form }),
				},
				router,
			});
	
			const messageText = pageMode === 'create' ? 'fetchSuccess.createdData' : 'fetchSuccess.editedData';
			router.push('/cabinet/templates');
			message.success(t(messageText));
		} catch (error) {
			console.error("Error in form submission:", error);
			const messageText = pageMode === 'create' ? 'fetchError.createData' : 'fetchError.changeData';
			message.error(t(messageText));
		}
	};

	const fetchDetail = async () => {
		setLoading(true);
		try {
			let data = await fetchClient({
				endpoint: `/templates/${_templateId}`,
        cookies: cookies,
				router
			})
			let {accessControl, allowedUsers, questions, ...mainFormData} = data; 
			setMainForm({ ...mainFormData });
			mainFormInstance.setFieldsValue(mainFormData); // This will populate the form fields
	
			setPrivacyForm({ accessControl, allowedUsers });
			privacyFormInstance.setFieldsValue({
				accessControl,
				allowedUsers,
			});
			questionsDispatch({ type: 'SET', newArray: questions });
		} catch (error) {
			console.error(`Error in fetching detail: ${error}`);
			message.error(t('fetchError.fetchData'));
		} finally {
			setLoading(false);
		}
	}

	const fetchTopics = async () => {
		setTopicsLoading(true);
		try {
			const data = await fetchClient({
				endpoint: '/topics',
        cookies: cookies,
				router
      })
      setTopics(data);
    } catch (error) {
			console.error(`Error in fetching topics: ${error}`);
      // message.error(t('fetchError.fetchData'));
    } finally {
			setTopicsLoading(false);
		}
	}

	const fetchTags = async () => {
		setTagsLoading(true);
		try {
			const data = await fetchClient({
				endpoint: '/tags',
        cookies: cookies,
				router
      })
      setTags(data);
    } catch (error) {
			console.error(`Error in fetching tags: ${error}`);
      // message.error(t('fetchError.fetchData'));
    } finally {
			setTagsLoading(false);
		}
	}

	const fetchUsers = async () => {
		setUsersLoading(true);
		try {
			const data = await fetchClient({
				endpoint: '/users',
        cookies: cookies,
				router
      })
      setUsers(data);
    } catch (error) {
			console.error(`Error in fetching users: ${error}`);
      // message.error(t('fetchError.fetchData'));
    } finally {
			setUsersLoading(false);
		}
	}

	useEffect(() => {
		if (pageMode == 'edit') {
			fetchDetail();
		}
	}, [pageMode])

	useEffect(() => {
		if (!mounted) {
			fetchTopics()
			fetchTags()
			fetchUsers()
		}
		setMounted(true);
	}, [])

	// if (!mounted) {
	// 	return null;
	// }

	return(
		<div className="dashbord_page">
			<Form.Provider>
				<header className="dashbord_page-header">
					<Row>
						<Col>
							<h3>
								{
									t(pageMode == 'create' ? 'CreateTemplate' : 'EditTemplate' )
								}
							</h3>
						</Col>
						<Col flex={1}/>
						<Col>
							<Button 
								htmlType="submit" 
								loading={loading} 
								onClick={handleSubmitForm} 
								type="primary" 
								icon={pageMode == 'create' ? <PlusOutlined/> : <SaveOutlined/>}
							>
								{t(pageMode == 'create' ? 'create' : 'save' )}
							</Button>
						</Col>
					</Row>
				</header>
				<main className="dashbord_page-main">
					<Spin spinning={loading}>
						<div className="dashbord_page-main dashbord_page-main-padding">
							<div className="template-item">
								<Form form={mainFormInstance} name="main-settings" layout="vertical">
									<div className="template-item-title">
										<h3>
											{t('MainSettings')}
										</h3>
									</div>
									<Form.Item rules={[{required: true}]} name='title' label={t('TemplateTitle')}>
										<Input 
											defaultValue={mainForm.title}
											value={mainForm.title} 
											placeholder={t('TemplateTitle')}
											onChange={(e) => {
												setMainForm(prev => {
													return {...prev, title: e.target.value}
												})
											}}
										/>
									</Form.Item>
									<Form.Item rules={[{required: true}]} name="description" label={t('TemplateDescription')}>
										<Input.TextArea 
											autoSize={{maxRows: 8, minRows: 3}} 
											placeholder={t('TemplateDescription')}
											onChange={(e) => {
												setMainForm(prev => {
													return {...prev, description: e.target.value}
												})
											}}
										/>
									</Form.Item>
									<Form.Item 
										rules={[{required: true}]} 
										name="topicId" 
										label={t('TemplateTopic')}
									>
										<Select 
											disabled={topicsLoading}
											loading={topicsLoading}
											optionFilterProp={'label'}
											allowClear
											placeholder={t('TemplateTopic')} 
											options={topics?.map((t) => ({
												value: t._id,
												label: t.name,
											}))}
											onChange={(v) => {
												setMainForm(prev => {
													return {...prev, topicId: v}
												})
											}}
										/>
									</Form.Item>
									<Form.Item name="tags" label={t('TemplateTags')}>
										<Select 
											disabled={tagsLoading}
											loading={tagsLoading}
											tagRender={
												(props) => {
													return (
														<Tag onClose={props.onClose} closable> 
															<big>
																{`# ${props.label}`}
															</big>
														</Tag>
													)
												}
											}
											onChange={(values, options) => {
												if (Array.isArray(options)) {
													setMainForm(prev => {
														return {...prev, tags: options.map((o, i) => {
															if (o?.value ) {
																return values[i]
															} else {
																return {
																	_id: 'new',
																	name: values[i]
																}
															}
														})}
													})
												}
											}}
											mode="tags"
											showSearch
											optionFilterProp={'label'}
											allowClear
											onInputKeyDown={handleTagsKeyDown}
											placeholder={t('TemplateTags')} 
											options={tags.map((t) => ({
												value: t._id,
                        label: t.name,
											}))}
										/>
									</Form.Item>
								</Form>
							</div>
							<div className="template-item">
								<div className="template-item-title">
									<Row gutter={[12, 12]} align={'middle'}>
										<Col>
											<h3>
												{t('question', {count: 'other'})}
											</h3>
										</Col>
										<Col flex={1}/>
										<Col>
											<Space>
												<Button 
													onClick={handleQuestionsExpand} 
													type="primary" 
													size="small" 
													icon={<VerticalAlignBottomOutlined/>}
												/>
												<Button 
													onClick={handleQuestionsCompact} 
													type="primary" 
													size="small" 
													icon={<ToTopOutlined/>}
												/>
											</Space>
										</Col>
									</Row>
								</div>
								<div className="template-question-list">
									<DndContext 
										modifiers={[restrictToVerticalAxis]} 
										onDragEnd={onDragEnd}
									>
										<SortableContext 
											items={questions.map((q) => q._id)} 
											strategy={verticalListSortingStrategy}
										>
											{
												questions.map((question, i) => (
													<React.Fragment key={question._id}>
														<DragRow rowcontext={RowContext} data-row-key={question._id}>
															<QuestionCard 
																setFormInstanceObject={setQuestionsFormInstance}
																formInstanceObject={questionsFormInstance}
																rowcontext={RowContext} 
																key={question._id} 
																question={question} 
																index={i} 
																dispatch={questionsDispatch} />
														</DragRow>
													</React.Fragment>
												))
											}
										</SortableContext>
									</DndContext>
								</div>
								<div className="template-question-add">
									<Button 
										icon={<PlusOutlined/>} 
										block 
										type="primary"
										onClick={() => {questionsDispatch({type: 'ADD', payload: {...initialQuestion, _id: Math.random()}})}}
									>
										{
											t('AddQuestion')
										}
									</Button>
								</div>
							</div>
							<div className="template-item">
								<Form form={privacyFormInstance} name="privacy-settings" layout="vertical">
									<div className="template-item-title">
										<Row gutter={[12, 12]} align={'middle'}>
											<Col>
												<h3>
													{t('PrivacySettings')}
												</h3>
											</Col>
											<Col flex={1}></Col>
										</Row>
									</div>
									<Form.Item label={t('AccessControl')} name='accessControl'>
										<Radio.Group 
											value={privacyForm.accessControl} 
											defaultValue={privacyForm.accessControl} 
											onChange={(e) => {
												setPrivacyForm(prev => {
                          return {...prev, accessControl: e.target.value}
                        })
											}}
										>
											<Space direction="vertical">
												<Radio value='public'>
													<span>{t('public')}</span>
													{': '}
													<small>{t('PublicDescription')}</small>
												</Radio>
												<Radio value='private'>
													<span>{t('private')}</span>
													{': '}
													<small>{t('PrivateDescription')}</small>
												</Radio>
											</Space>
										</Radio.Group>
									</Form.Item>
									{
										privacyForm.accessControl == 'private' &&
										<Form.Item name='allowedUsers' label={t('ChooseUsers')}>
											<Select 
												loading={usersLoading}
												disabled={usersLoading}
												mode="multiple"
												optionFilterProp={'label'}
												allowClear
												value={privacyForm.allowedUsers}
												placeholder={t('ChooseUsers')} 
												options={users.map(user => ({
													label: `${user.name} ( ${user.email} )`,
													value: user._id,
												}))}
												onChange={(values) => {
													if (Array.isArray(values)) {
														setPrivacyForm(prev => {
															return {...prev, allowedUsers: values}
														})
													}
												}}
											/>
										</Form.Item>
									}
								</Form>
							</div>
						</div>
					</Spin>
				</main>
			</Form.Provider>
		</div>
	)
}

export default App;