// Lightweight local "auth" layer for the URBANEYE demo.
// There is no backend auth service in this build, so accounts are kept in
// localStorage. This is fine for a demo/pitch, but should be swapped for a
// real backend (with hashed passwords) before handling real users.

const STORAGE_KEY = 'urbaneye_credentials'

const DEFAULT_ACCOUNTS = [
  {
    username: 'admin.urbaneye',
    password: 'admin123',
    displayName: 'Command Controller',
    role: 'System Administrator',
    provider: 'local'
  },
  {
    username: 'pwd.officer',
    password: 'pwd123',
    displayName: 'Er. R. Sharma (PWD)',
    role: 'PWD Officer',
    provider: 'local'
  },
  {
    username: 'crew.lead',
    password: 'crew123',
    displayName: 'Crew 07 Lead',
    role: 'Crew Dispatcher',
    provider: 'local'
  }
]

function loadAccounts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {
    // fall through to reseed
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS))
  return DEFAULT_ACCOUNTS
}

function saveAccounts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function normalize(username) {
  return username.trim().toLowerCase()
}

export function findAccount(username) {
  if (!username) return null
  const list = loadAccounts()
  return list.find((acc) => normalize(acc.username) === normalize(username)) || null
}

export function verifyCredentials(username, password) {
  const account = findAccount(username)
  if (!account) return null
  if (account.provider === 'google') return null
  return account.password === password ? account : null
}

export function registerAccount({ username, password, displayName, role }) {
  const list = loadAccounts()
  if (findAccount(username)) {
    throw new Error('That username is already taken.')
  }
  const account = {
    username: username.trim(),
    password,
    displayName: displayName.trim() || username.trim(),
    role: role || 'System Administrator',
    provider: 'local'
  }
  list.push(account)
  saveAccounts(list)
  return account
}

// Simulated "Sign in with Google" — creates/reuses a local profile keyed by
// email. Swap this for @react-oauth/google (or similar) + real backend
// token verification to go live. A password is still required and checked
// here (see verifyGoogleCredentials) so the demo actually validates the
// user before letting them in, instead of trusting any typed email.
export function upsertGoogleAccount({ email, displayName, password }) {
  const list = loadAccounts()
  const username = normalize(email)
  const existing = list.find((acc) => normalize(acc.username) === username)
  if (existing) return existing

  const account = {
    username: email.trim(),
    password: password || null,
    displayName: displayName || email.split('@')[0],
    role: 'System Administrator',
    provider: 'google',
    email: email.trim()
  }
  list.push(account)
  saveAccounts(list)
  return account
}

export function verifyGoogleCredentials(email, password) {
  const account = findAccount(email)
  if (!account || account.provider !== 'google') return null
  return account.password === password ? account : null
}

// --- Remembered Google accounts (device-level, like a real Google account
// chooser) ---------------------------------------------------------------
// This is separate from the credential store above: it just remembers which
// Google profiles have signed in on this browser, so the login screen can
// show a "Continue as {name}" chooser instead of asking for an email every
// time. Swap for Google Identity Services' native account chooser to go live.
const GOOGLE_ACCOUNTS_KEY = 'urbaneye_google_accounts'
const MAX_REMEMBERED_GOOGLE_ACCOUNTS = 4

export function getRememberedGoogleAccounts() {
  try {
    const stored = localStorage.getItem(GOOGLE_ACCOUNTS_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function rememberGoogleAccount({ email, displayName }) {
  const list = getRememberedGoogleAccounts().filter(
    (acc) => normalize(acc.email) !== normalize(email)
  )
  list.unshift({ email: email.trim(), displayName })
  const trimmed = list.slice(0, MAX_REMEMBERED_GOOGLE_ACCOUNTS)
  localStorage.setItem(GOOGLE_ACCOUNTS_KEY, JSON.stringify(trimmed))
  return trimmed
}

export function forgetGoogleAccount(email) {
  const list = getRememberedGoogleAccounts().filter(
    (acc) => normalize(acc.email) !== normalize(email)
  )
  localStorage.setItem(GOOGLE_ACCOUNTS_KEY, JSON.stringify(list))
  return list
}
