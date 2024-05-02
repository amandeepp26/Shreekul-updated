import { combineReducers } from 'redux';

import session from '../modules/auth/session';
import signin from '../modules/auth/signin';
import search from '../redux/Matrimony/Search'

export default combineReducers({
  session,
  signin,
  search,
});
