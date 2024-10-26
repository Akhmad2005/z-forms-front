interface FormDetail {
	_id: string;
	templateId: string;
	answers: Answer[];
	userId: string;
	createdDate: string;
}

interface Answer {
  questionId: string;
  answer: any;
	_id: string;
}

interface FormListItem {
	createdDate: string;
	onTableVisibleQuestions: FormListQuestion[]
	templateId: string;
	templateTitle: string;
	userId: string;
	user: string;
	_id: string;
}

interface FormListQuestion {
  title: string;
  answer: any;
	_id: string;
}