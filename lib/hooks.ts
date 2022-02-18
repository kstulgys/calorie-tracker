import { useQuery, useMutation, useQueryClient } from 'react-query'

type FetcherProps = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, any>
}

export type Entry = {
  name: string
  calories: number
  createdAt: string
  price: number
}

export type CreateEntryBody = {
  data: Entry
}

export type UpdateEntryBody = {
  id: string
  data: {
    name?: string
    calories?: number
    price?: number
    updatedAt: string
  }
}

type UpdateMeBody = {
  data: {
    calorieLimitPerDay?: number
    budgetLimitPerMonth?: number
  }
}

type AuthProps = {
  type: 'signup' | 'signin'
  data: {
    email: string
    password: string
  }
}

async function fetcher(props: FetcherProps) {
  const { url, method = 'GET', body } = props
  return fetch(`${window.location.origin}/api${url}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then((res) => res.json())
}

async function createEntry(body: CreateEntryBody) {
  return fetcher({ url: '/entries', method: 'POST', body })
}

async function updateMe(body: UpdateMeBody) {
  return fetcher({ url: `/me`, method: 'PUT', body })
}
async function updateEntry(props: UpdateEntryBody) {
  const { id, data } = props
  return fetcher({ url: `/entries/${id}`, method: 'PUT', body: { data } })
}

async function deleteEntry(id: string) {
  return fetcher({ url: `/api/entries/${id}`, method: 'DELETE' })
}

async function auth(props: AuthProps) {
  const { type, data } = props
  return fetcher({ url: `/${type}`, method: 'POST', body: { data } })
}

/**
 * Queries
 */

export function useMeQuery() {
  return useQuery('me', () => fetcher({ url: '/me' }))
}

export function useEntriesQuery({ gte, lt }) {
  return useQuery(['entries', gte, lt], () => fetcher({ url: `/entries?gte=${gte}&lt=${lt}` }), {
    enabled: !!gte && !!lt,
  })
}

export function useAverageCaloriesQuery({ gte, lt }) {
  return useQuery(['averageCalories', gte, lt], () => fetcher({ url: `/stats/averageCalories?gte=${gte}&lt=${lt}` }), {
    enabled: !!gte && !!lt,
  })
}

export function useAllEntriesQuery() {
  return useQuery(['entries'], () => fetcher({ url: `/entries` }))
}

export function useEntryQuery(id: string) {
  return useQuery(['entries', id], () => fetcher({ url: `/entries/${id}` }), {
    enabled: !!id,
  })
}

/**
 * Mutations
 */

export function useUpdateMeMutation() {
  const client = useQueryClient()
  return useMutation(updateMe, {
    onSuccess: () => {
      client.refetchQueries('me')
    },
  })
}

export function useCreateEntryMutation() {
  const client = useQueryClient()
  return useMutation(createEntry, {
    onSuccess: () => {
      client.refetchQueries('entries')
    },
  })
}

export function useUpdateEntryMutation() {
  const client = useQueryClient()
  return useMutation(updateEntry, {
    onSuccess: () => {
      client.refetchQueries('entries')
    },
  })
}

export function useDeleteEntryMutation() {
  const client = useQueryClient()
  return useMutation(deleteEntry, {
    onSuccess: () => {
      client.refetchQueries('entries')
    },
  })
}
export function useAuthMutation() {
  return useMutation(auth)
}
