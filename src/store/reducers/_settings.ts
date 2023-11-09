import { TAction, TSettings } from 'common/types';
import { THEMES, LANGUAGES } from 'common/constants';
import { UPDATE_SETTINGS } from 'store/action-types';

const initialState: TSettings = {
  theme: THEMES.LIGHT,
  locale: LANGUAGES.EN,
};

export const settings = (state = initialState, action: TAction) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return { ...state, ...payload };
    default:
      return state;
  }
};