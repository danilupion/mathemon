import { createContext, useContext } from 'react';

import { QuizStore } from '../stores/quizStore';

interface StoreContext {
  quiz: QuizStore;
}

const storeContext = createContext<StoreContext>({
  quiz: new QuizStore(),
});

export default () => useContext(storeContext);

export const useQuizStore = () => useContext(storeContext).quiz;
