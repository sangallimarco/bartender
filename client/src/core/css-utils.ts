import { Types } from './types';

export type BooleanDictionary = Types.Dictionary<boolean | string | number | undefined>;
export type ClassNameItem = BooleanDictionary | string | undefined;

export namespace CSSUtils {
    export function parse(...args: ClassNameItem[]): string {
        const className: string[] = [];

        args.forEach((item: ClassNameItem) => {
            if (item) {
                if (typeof item === 'object') {
                    const filtered = filterDictionary(item as BooleanDictionary);
                    className.push(...filtered);
                } else {
                    className.push(item);
                }
            }
        });
        return className.join(' ');
    }

    export function filterDictionary(dictionary: BooleanDictionary): string[] {
        const className: string[] = [];

        Object.keys(dictionary).forEach((key: string) => {
            const val = dictionary[key];
            if (val) {
                className.push(key);
            }
        });
        return className;
    }

    export function join(...args: string[]): string {
        return args.reduce((acc: string, arg: string) => (arg ? `${acc} ${arg}` : acc), '');
    }
}
