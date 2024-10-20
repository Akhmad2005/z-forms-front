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