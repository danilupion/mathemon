import { createContext, useContext } from 'react';

import { AuthStore } from '../stores/authStore';
import { QuizStore } from '../stores/quizStore';

interface StoreContext {
  authStore: AuthStore;
  quiz: QuizStore;
}

const storeContext = createContext<StoreContext>({
  authStore: new AuthStore(),
  quiz: new QuizStore(),
});

const useStore = () => useContext(storeContext);

export default useStore;

export const useAuthStore = () => useContext(storeContext).authStore;

export const useQuizStore = () => useContext(storeContext).quiz;
