import Strings from 'constants/strings';
import { EvolutionForms } from 'constants/evolutions';

import {
  iterateMapToArray,
  iterateKeysToArray,
  createIdStringFromSet
} from 'utils/common';

class HighlightMemberService {
  constructor() {
    this.__cache = {};
    this.__members = null;
    this.__types = null;
  }

  forMembers(members) {
    this.__members = members;
    return this;
  }

  withTypes(types) {
    this.__types = types;
    return this;
  }

  withGroup(dataType) {
    this.__group = dataType;
    return this;
  }

  selectMembers(dataId) {
    this.dataId = dataId;

    const idString = createIdStringFromSet(iterateKeysToArray(this.__members));
    const cacheKey = `${idString}${this.__group}${this.dataId}`;
    const cachedValue = this.__cache[cacheKey];
    if (cachedValue) return cachedValue;

    let result = [];
    const membersArr = iterateMapToArray(this.__members);

    switch (this.__group) {
      case Strings.typeBreakdown.weakTo:
      case Strings.typeBreakdown.resists:
      case Strings.typeBreakdown.unaffectedBy:
        const typeIds = this.__types.get(dataId)[this.__group];
        result = membersArr.filter((x) =>
          x.types.some((t) => typeIds.includes(t.id))
        );
        break;
      case 'Evolutions':
        result = membersArr.filter(
          (x) =>
            (dataId === EvolutionForms.notEvolved && x.evolutions.length) ||
            (dataId === EvolutionForms.fullyEvolved && !x.evolutions.length)
        );
        break;
      case 'Generations':
        result = membersArr.filter((x) => x.generation === dataId);
        break;
      default:
        result = [];
    }

    const memberIds = result.map((x) => x.id);
    this.__cache[cacheKey] = memberIds;
    return memberIds;
  }
}

const instance = new HighlightMemberService();
export default instance;
