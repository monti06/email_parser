import {getMomentDateObject} from "./index";
import {getIndices} from "./index";

test('should return date in specific format', () => {
    const date = '13 May 2020';
    expect(getMomentDateObject(date)).toEqual('2020-05-13');
  });

test('should return indexes of elements containing :', () => {
    const array = ['24/05/2012:','hello','you:','25 Aug 17:','ug:75'];
    expect(getIndices(array)).toEqual([0,2,3,4]);
});