import { postJson } from './client'

export type ContactRequest = {
  name: string
  email: string
  message: string
}

type ContactResponse = {
  message: string
}

/** Resolves only once the backend has emailed the message; rejects with an ApiError otherwise. */
export const sendContactMessage = (request: ContactRequest) =>
  postJson<ContactResponse>('/api/contact', request)
