import Alert from 'meiko/modules/components/Alert';
import {
  Button,
  withButtonisation,
  withCustomButtonWrapper
} from 'meiko/modules/components/Button';
import ClearableInput from 'meiko/modules/components/ClearableInput';
import Header from 'meiko/modules/components/Header';
import Image from 'meiko/modules/components/Image';
import MultiSelect from 'meiko/modules/components/MultiSelect';
import NewTabLink from 'meiko/modules/components/NewTabLink';
import Tickbox from 'meiko/modules/components/Tickbox';

import generateUniqueId from 'meiko/modules/utils/generateUniqueId';
import createListeners from 'meiko/modules/utils/createListeners';
import {
  capitalise,
  capitaliseEachWord,
  separateAndCapitalise,
  separateAndCapitaliseAll
} from 'meiko/modules/utils/capitalise';
import objectsAreEqual from 'meiko/modules/utils/objectsAreEqual';
import getKeyByValue from 'meiko/modules/utils/getKeyByValue';
import {
  persistObjectToLocalStorage,
  getObjectFromLocalStorageByProperty
} from 'meiko/modules/utils/localStorage';
import Icons from 'meiko/modules/constants/icons';

export {
  Alert,
  Button,
  withButtonisation,
  withCustomButtonWrapper,
  ClearableInput,
  Header,
  Image,
  MultiSelect,
  NewTabLink,
  Tickbox,
  //constants
  Icons,
  // fns
  capitalise,
  capitaliseEachWord,
  separateAndCapitalise,
  separateAndCapitaliseAll,
  getKeyByValue,
  objectsAreEqual,
  generateUniqueId,
  createListeners,
  persistObjectToLocalStorage,
  getObjectFromLocalStorageByProperty
};
