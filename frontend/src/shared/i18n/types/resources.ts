import ruTranslation from '../data/ru.json' with { type: 'json' };

type PathsToString<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${PathsToString<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

export type Translation = PathsToString<(typeof resources)['ruTranslation']>;

const resources = {
  ruTranslation,
} as const;

export default resources;
