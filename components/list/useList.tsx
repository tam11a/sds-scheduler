"use client";

import { useQueryStates } from "nuqs";
import { listSearchParams } from "./searchParams";

function useList() {
  const [params, setSearchParams] = useQueryStates(listSearchParams);

  return {
    search: params.search,
    setSearch: (search: string) => setSearchParams({ search }),
    view: params.view,
    setView: (view: "card-view" | "table-view") => setSearchParams({ view }),
  };
}

export default useList;
