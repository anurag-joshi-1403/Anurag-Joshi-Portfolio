import { CircleAlert, CircleCheck, LoaderCircle, Send } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { sendContactMessage } from '../api/contact'
import buttonStyles from './Button.module.css'
import styles from './ContactForm.module.css'

type Field = 'name' | 'email' | 'message'
type Values = Record<Field, string>
type FieldErrors = Partial<Record<Field, string>>
type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; message: string }
  | { kind: 'failed'; message: string }

const FIELDS: readonly Field[] = ['name', 'email', 'message']
const EMPTY: Values = { name: '', email: '', message: '' }
const MAX_LENGTH: Record<Field, number> = { name: 100, email: 254, message: 5000 }
// Same rule as the backend's @Email(regexp) on ContactRequest.
const EMAIL_PATTERN = /.+@.+\..+/

/** Mirrors the backend's validation messages, so client and server errors read the same. */
function validate(field: Field, raw: string): string | undefined {
  const value = raw.trim()
  switch (field) {
    case 'name':
      if (!value) return 'Please enter your name.'
      break
    case 'email':
      if (!value) return 'Please enter your email address.'
      if (!EMAIL_PATTERN.test(value)) return 'Please enter a valid email address.'
      break
    case 'message':
      if (!value) return 'Please enter a message.'
      break
  }
  return undefined
}

function isField(key: string): key is Field {
  return (FIELDS as readonly string[]).includes(key)
}

type ContactFormProps = {
  /** Shown as a fallback when sending fails, if the owner's email is known. */
  fallbackEmail: string | null
}

export function ContactForm({ fallbackEmail }: ContactFormProps) {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [edited, setEdited] = useState<Partial<Record<Field, boolean>>>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const focusFirstError = (fieldErrors: FieldErrors) => {
    const first = FIELDS.find((field) => fieldErrors[field])
    if (first) document.getElementById(`contact-${first}`)?.focus()
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as Field
    const value = event.target.value
    setValues((current) => ({ ...current, [field]: value }))
    setEdited((current) => ({ ...current, [field]: true }))
    // Clear an error as soon as the visitor fixes it, but don't add new ones mid-typing.
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validate(field, value) }))
    if (status.kind === 'sent' || status.kind === 'failed') setStatus({ kind: 'idle' })
  }

  // Check a field when the visitor leaves it, but only once they've typed in it.
  const handleBlur = (field: Field) => {
    if (edited[field]) setErrors((current) => ({ ...current, [field]: validate(field, values[field]) }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status.kind === 'sending') return

    const clientErrors: FieldErrors = {}
    for (const field of FIELDS) {
      const error = validate(field, values[field])
      if (error) clientErrors[field] = error
    }
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) {
      focusFirstError(clientErrors)
      return
    }

    setStatus({ kind: 'sending' })
    try {
      const response = await sendContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      })
      setValues(EMPTY)
      setEdited({})
      setStatus({ kind: 'sent', message: response.message })
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError('Something went wrong.', 0)
      const serverErrors: FieldErrors = {}
      for (const [key, message] of Object.entries(apiError.fieldErrors)) {
        if (isField(key)) serverErrors[key] = message
      }
      setErrors(serverErrors)
      focusFirstError(serverErrors)
      setStatus({ kind: 'failed', message: apiError.message })
    }
  }

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    maxLength: MAX_LENGTH[field],
    required: true,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
    onChange: handleChange,
    onBlur: () => handleBlur(field),
  })

  const fieldError = (field: Field) =>
    errors[field] && (
      <p id={`contact-${field}-error`} className={styles.fieldError}>
        <CircleAlert aria-hidden="true" />
        {errors[field]}
      </p>
    )

  const sending = status.kind === 'sending'
  const hasFieldErrors = FIELDS.some((field) => errors[field])

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate aria-describedby="contact-required-note">
      <p id="contact-required-note" className={styles.note}>
        All fields are required.
      </p>

      <div className={styles.field}>
        <label htmlFor="contact-name">Name</label>
        <input {...fieldProps('name')} type="text" autoComplete="name" enterKeyHint="next" />
        {fieldError('name')}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email">Email</label>
        <input
          {...fieldProps('email')}
          type="email"
          autoComplete="email"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="next"
        />
        {fieldError('email')}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">Message</label>
        <textarea {...fieldProps('message')} rows={6} />
        {fieldError('message')}
      </div>

      <div>
        <button type="submit" className={`${buttonStyles.button} ${buttonStyles.primary}`} disabled={sending}>
          {sending ? (
            <>
              <LoaderCircle aria-hidden="true" className={styles.spinner} />
              Sending&hellip;
            </>
          ) : (
            <>
              <Send aria-hidden="true" />
              Send message
            </>
          )}
        </button>

        {/* Always rendered (never display: none), so screen readers announce what appears in it. */}
        <div className={styles.status} aria-live="polite">
          {status.kind === 'sent' && (
            <p className={styles.sent}>
              <CircleCheck aria-hidden="true" />
              {status.message}
            </p>
          )}
          {status.kind === 'failed' && (
            <p className={styles.failed}>
              <CircleAlert aria-hidden="true" />
              <span>
                {status.message}
                {/* Offer the direct route only when the problem isn't something the visitor can fix. */}
                {fallbackEmail && !hasFieldErrors && (
                  <>
                    {' '}
                    You can also email me directly at <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>.
                  </>
                )}
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  )
}
