import 'server-only';

const dictionaries = {
  mn: () => import('@/dictionaries/mn.json').then((module) => module.default),
  ru: () => import('@/dictionaries/ru.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'mn' | 'ru') => dictionaries[locale]();