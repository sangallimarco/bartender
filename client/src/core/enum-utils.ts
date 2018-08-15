import {range} from 'lodash';

export function generateRangeFromEnumKeys(value: {}): number[] {
    return range(Object.keys(value).length/2);
}