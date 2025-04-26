import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = "https://zidio-task-management-tanmoy9088.vercel.app/";

const baseQuery = fetchBaseQuery({ baseUrl:' https://zidio-task-management-tanmoy9088.vercel.app/ '});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});