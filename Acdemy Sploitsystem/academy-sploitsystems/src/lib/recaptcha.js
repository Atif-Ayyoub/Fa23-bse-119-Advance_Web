const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

let recaptchaScriptPromise

export const isRecaptchaConfigured = Boolean(RECAPTCHA_SITE_KEY)

function loadRecaptchaScript() {
  if (!RECAPTCHA_SITE_KEY) {
    throw new Error('reCAPTCHA is not configured. Set VITE_RECAPTCHA_SITE_KEY to enable form protection.')
  }

  if (window.grecaptcha?.execute) {
    return Promise.resolve(window.grecaptcha)
  }

  if (!recaptchaScriptPromise) {
    recaptchaScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[data-recaptcha-key="${RECAPTCHA_SITE_KEY}"]`)

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.grecaptcha), { once: true })
        existingScript.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA script.')), { once: true })
        return
      }

      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`
      script.async = true
      script.defer = true
      script.dataset.recaptchaKey = RECAPTCHA_SITE_KEY
      script.onload = () => resolve(window.grecaptcha)
      script.onerror = () => reject(new Error('Failed to load reCAPTCHA script.'))
      document.head.appendChild(script)
    })
  }

  return recaptchaScriptPromise
}

export async function getRecaptchaToken(action) {
  const grecaptcha = await loadRecaptchaScript()

  return new Promise((resolve, reject) => {
    grecaptcha.ready(async () => {
      try {
        const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
        resolve(token)
      } catch {
        reject(new Error('Unable to verify reCAPTCHA at the moment. Please try again.'))
      }
    })
  })
}