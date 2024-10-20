import { UniqueIdentifier } from "@dnd-kit/core";
import { AnswerTypeEnum } from "../enums/answer";

export type Question = {
  title: string;
	isVisibleInTable: boolean;
	description: string;
  answerType: AnswerTypeEnum;
  _id: UniqueIdentifier;
  compacted: boolean;
};

export type QuestionAction =
  | { type: 'ADD'; payload: Question }
  | { type: 'REMOVE'; index: number }
  | { type: 'EDIT'; index: number | 'all'; payload: Partial<Question> }
  | { type: 'MOVE'; activeId: UniqueIdentifier; overId: UniqueIdentifier}
  | { type: 'SET'; newArray: Question[] }