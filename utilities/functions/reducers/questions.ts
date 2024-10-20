import { Question, QuestionAction as Action } from "@/utilities/types/question";
import { arrayMove } from "@dnd-kit/sortable";

export const questionsReducer = (state: Question[], action: Action): Question[] => {
	switch (action.type) {
		case 'ADD':
			return [...state, action.payload];
		case 'REMOVE':
			return state.filter((_, idx) => idx !== action.index);
		case 'EDIT':
			if (action.index == 'all') {
				return state.map((question) => 
				({...question, ...action.payload})
				)				
			} else {
				return state.map((question, idx) =>
					idx === action.index ? { ...question, ...action.payload } : question
				);
			}
		case 'MOVE': 
			const activeIndex = state.findIndex((record) => record._id === action.activeId);
      const overIndex = state.findIndex((record) => record._id === action.overId);
			let newArray = new Array(...arrayMove(state, activeIndex, overIndex));
      return newArray
		case 'SET': 
			return new Array(...action.newArray)
		default:
			return state;
	}
};