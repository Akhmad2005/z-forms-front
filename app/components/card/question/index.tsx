'use client'
import { ChangeEvent, Context, Dispatch, useContext, useEffect, useState } from "react";
import { Badge, Form, Input, Row, Col, Button, Switch, Select, FormInstance } from "antd"
import {ToTopOutlined, VerticalAlignBottomOutlined, HolderOutlined} from '@ant-design/icons'
import { useTranslations } from "next-intl";
import type { Question, QuestionAction as Action } from "@/utilities/types/question";
import { AnswerTypeEnum } from "@/utilities/enums/answer";
import { RowContextProps } from "@/utilities/interfaces/drag/row";

interface Props {
	index: number;
	question: Question;
	dispatch: Dispatch<Action>;
	rowcontext: Context<RowContextProps>;
	formInstanceObject: { [key: string]: FormInstance<any>}
	setFormInstanceObject: React.Dispatch<React.SetStateAction<{[key: string]: FormInstance<any>}>>
}

const QuestionCard = ({index, question, dispatch, rowcontext, formInstanceObject, setFormInstanceObject}: Props) => {
	const {setActivatorNodeRef, listeners} = useContext(rowcontext);
	const [answerTypes, setAnswerTypes ] = useState<AnswerTypeEnum[]>([]);
	const [mounted, setMounted ] = useState<boolean>(false);
	const t = useTranslations();
	const [formInstance] = Form.useForm();
	
	useEffect(() => {
		if (!mounted) {
			setFormInstanceObject(prev => {
				return {...prev, [index]: formInstance}
			})
			formInstance.setFieldsValue(question)
		}
		setMounted(true);
		let a: AnswerTypeEnum[] = []
		Object.values(AnswerTypeEnum).forEach((element) => {
			a.push(element);
		});
		setAnswerTypes(a);
	}, [AnswerTypeEnum])

	return (
		<Badge.Ribbon text={index + 1}>
			<div className="template-question">
				<Form form={formInstance} name={`question-${index}`} layout="vertical">
					<Form.Item 
						rules={[
							{
								required: true,
							}
						]} 
						name='title' 
						label={t('title')}
					>
						<Input 
							value={question.title} 
							placeholder={t('title')}
							onChange={(e: ChangeEvent<HTMLInputElement>) => {
								dispatch({
									type: 'EDIT',
									index: index,
									payload: { title: e.target.value },
								})
							}} 
							/>
					</Form.Item>	
					<div style={{display: question.compacted ? 'none' : 'initial'}}>
						<Form.Item 
							rules={[
								{
									required: true,
								}
							]}
							name='description' 
							label={t('description')}
						>
							<Input.TextArea
								autoSize={{
									maxRows: 4,
									minRows: 2,
								}}
								value={question.description} 
								onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
									dispatch({
										type: 'EDIT',
										index: index,
										payload: { description: e.target.value },
									})
								}} 
								placeholder={t('description')}
								/>
						</Form.Item>	
						<Form.Item 
							name='answerType' 
							label={t('TypeOfAnswer')}
							rules={[
								{
									required: true,
								}
							]}
						>
							<Select 
								optionFilterProp={'label'}
								defaultValue={question.answerType}
								value={question.answerType}
								onChange={(value: AnswerTypeEnum) => {
									dispatch({
										type: 'EDIT',
										index: index,
										payload: { answerType: value },
									})
								}}
								options={
									answerTypes?.map((item) => ({ label: t(`AnswerType.${item}`), value: item }))
								} 
								placeholder={t('TypeOfAnswer')}
								labelRender={() => <>{t(`AnswerType.${question.answerType}`)}</>}
							>

							</Select>
						</Form.Item>	
						<Form.Item name='isVisibleInTable' label={t('ShowInTheTable')}>
							<Switch 
								checked={question.isVisibleInTable}
								onChange={(checked: boolean) => {
									dispatch({
										type: 'EDIT',
										index: index,
										payload: { isVisibleInTable: checked },
									})
								}}
							></Switch>
						</Form.Item>
					</div>	
					<Row gutter={[12, 12]} align={'middle'}>
						<Col flex={1}>
							<Button 
								icon={<HolderOutlined/>} 
								block 
								type="primary"
								size="small"
								style={{ cursor: 'move' }}
								ref={setActivatorNodeRef}
								{...listeners}
							>
							</Button>
						</Col>
						<Col 
							onClick={() => {
								dispatch({
									type: 'EDIT',
									index: index,
									payload: { compacted: !question.compacted },
								})
							}}
						>
							<Button 
								type="primary" 
								size="small"
								icon={question.compacted ? <VerticalAlignBottomOutlined /> : <ToTopOutlined />} 
							/>
						</Col>
						<Col>
							<Button 
								danger 
								type="primary"
								size="small"
								onClick={() => {
									dispatch({
                    type: 'REMOVE',
                    index: index,
                  })
								}}
							>
								{t('delete')}
							</Button>
						</Col>
					</Row>
				</Form>	
			</div>
	</Badge.Ribbon>
	)
}

export default QuestionCard;