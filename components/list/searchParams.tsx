import {
  createSearchParamsCache,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const listSearchParams = {
  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  view: parseAsStringEnum(["card-view", "table-view"])
    .withDefault("card-view")
    .withOptions({ clearOnDefault: true }),
};

export const listSearchParamsCache = createSearchParamsCache(listSearchParams);
