'use client'

import styles from './index.module.scss'
import { Badge, FormInstance } from 'antd';
import { Question } from "@/utilities/types/question";
import AnswerTypeItem from '../../g/answerType';

interface Props {
	question?: Question;
	index: number;
	form: FormInstance<any>;
	formKey: string[] | string;
	mode?: pageMode;
}

const FormQuestionCard = ({question, index, form, formKey, mode}: Props) => {
	if (!question) {
		return null
	}
	return (
		<Badge.Ribbon text={index + 1}>
			<div className={styles['card']}>
				<div className={styles['card-title']}>
					<h3>
						{ question.title || '' }
					</h3>
				</div>
				<div className={styles['card-description']}>
					<span>
						{ question.description || '' }
					</span>
				</div>
				<div className={styles['card-question']}>
					{
						mode != 'readonly' ?
						<AnswerTypeItem formKey={formKey} form={form} type={question.answerType} placeholder={question.title}/> 
						:
						<strong>
							{
								form.getFieldValue(formKey)
							}
						</strong>
					}
				</div>
			</div>
		</Badge.Ribbon>
	)
}

export default FormQuestionCard;