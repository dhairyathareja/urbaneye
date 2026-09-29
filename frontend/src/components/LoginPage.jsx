import React, { useState } from 'react'
import globeVideo from '../assets/urbaneye-globe.mp4'
import globePoster from '../assets/urbaneye-globe-poster.png'
import {
  UserRound,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  IdCard,
  ChevronRight
} from 'lucide-react'
import {
  verifyCredentials,
  registerAccount,
  findAccount,
  upsertGoogleAccount,
  verifyGoogleCredentials,
  getRememberedGoogleAccounts,
  rememberGoogleAccount
} from '../auth'

const ROLES = ['System Administrator', 'PWD Officer', 'Crew Dispatcher']

const AVATAR_COLORS = ['#1a73e8', '#d93025', '#188038', '#f9ab00', '#9334e6', '#e8710a']

function avatarColorFor(seed = '') {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function initialFor(account) {
  const source = (account.displayName || account.email || '?').trim()
  return source.charAt(0).toUpperCase()
}

function GoogleIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.87-3.04.87-2.34 0-4.32-1.58-5.03-3.71H.95v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.05l3.02-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.95l3.02 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  )
}

// Google-style account chooser / sign-in modal. Mirrors the real Google
// flow: pick a remembered account (or "Use another account"), then a
// password screen actually validates the credential before letting anyone
// through — a fresh email goes through a one-time "create a password" step
// instead of being trusted outright.
function GoogleAccountChooser({
  step,
  accounts,
  pendingAccount,
  newEmail,
  setNewEmail,
  password,
  setPassword,
  passwordConfirm,
  setPasswordConfirm,
  error,
  connectingEmail,
  onSelectAccount,
  onAddAccount,
  onEmailNext,
  onVerifyPassword,
  onCreatePassword,
  onNotYou,
  onBackToChooser,
  onClose
}) {
  const busy = !!connectingEmail

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in with Google"
      onClick={() => !busy && onClose()}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl bg-white shadow-2xl overflow-hidden"
        style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {step === 'password' || step === 'create-password' ? (
          <div className="flex flex-col items-center pt-8 pb-4 px-8">
            <span
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-medium"
              style={{ background: avatarColorFor(pendingAccount?.email || '') }}
            >
              {initialFor(pendingAccount || {})}
            </span>
            <h2 className="mt-4 text-[18px] leading-6 text-[#1f1f1f] font-normal text-center">
              {pendingAccount?.displayName || pendingAccount?.email}
            </h2>
            {pendingAccount?.displayName && (
              <p className="text-[13px] text-[#5f6368]">{pendingAccount.email}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center pt-8 pb-4 px-8">
            <GoogleIcon size={40} />
            <h2 className="mt-4 text-[20px] leading-6 text-[#1f1f1f] font-normal text-center">
              {step === 'chooser' ? 'Choose an account' : 'Sign in'}
            </h2>
            <p className="mt-2 text-[14px] text-[#444] text-center">
              {step === 'chooser' ? (
                <>to continue to <span className="font-medium text-[#1f1f1f]">URBANEYE</span></>
              ) : (
                'Use your Google Account'
              )}
            </p>
          </div>
        )}

        {/* Chooser step */}
        {step === 'chooser' && (
          <div className="px-2 pb-2">
            {accounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                className="w-full flex items-center gap-3 px-6 py-3 hover:bg-[#f2f2f2] rounded-lg transition-colors text-left"
                onClick={() => onSelectAccount(acc)}
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[15px] font-medium shrink-0"
                  style={{ background: avatarColorFor(acc.email) }}
                >
                  {initialFor(acc)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] text-[#1f1f1f] truncate">{acc.displayName}</span>
                  <span className="block text-[12px] text-[#5f6368] truncate">{acc.email}</span>
                </span>
                <ChevronRight size={16} className="text-[#5f6368] shrink-0" />
              </button>
            ))}

            <button
              type="button"
              className="w-full flex items-center gap-3 px-6 py-3 hover:bg-[#f2f2f2] rounded-lg transition-colors text-left"
              onClick={onAddAccount}
            >
              <span className="w-9 h-9 rounded-full border border-[#dadce0] flex items-center justify-center shrink-0">
                <UserRound size={16} className="text-[#5f6368]" />
              </span>
              <span className="text-[14px] text-[#1f1f1f]">Use another account</span>
            </button>
          </div>
        )}

        {/* Email step */}
        {step === 'email' && (
          <form onSubmit={onEmailNext} className="px-8 pb-2">
            <label className="block text-[13px] text-[#5f6368] mb-1.5" htmlFor="google-email">
              Email or phone
            </label>
            <input
              id="google-email"
              type="email"
              autoFocus
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[#dadce0] px-3.5 py-2.5 text-[15px] text-[#1f1f1f] outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
            />
            {error && <p className="mt-2 text-[13px] text-[#d93025]">{error}</p>}
            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-[#1a73e8] hover:bg-[#1765cc] text-white text-[14px] font-medium py-2.5 disabled:opacity-60"
              disabled={busy}
            >
              {busy ? 'Checking...' : 'Next'}
            </button>
            {accounts.length > 0 && (
              <button
                type="button"
                onClick={onBackToChooser}
                className="mt-3 w-full text-center text-[13px] text-[#1a73e8] font-medium py-1"
              >
                Back
              </button>
            )}
          </form>
        )}

        {/* Verify password step (returning account) */}
        {step === 'password' && (
          <form onSubmit={onVerifyPassword} className="px-8 pb-2">
            <label className="block text-[13px] text-[#5f6368] mb-1.5" htmlFor="google-password">
              Enter your password
            </label>
            <input
              id="google-password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-[#dadce0] px-3.5 py-2.5 text-[15px] text-[#1f1f1f] outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
            />
            {error && <p className="mt-2 text-[13px] text-[#d93025]">{error}</p>}
            <button
              type="button"
              onClick={onNotYou}
              className="mt-4 text-[13px] text-[#1a73e8] font-medium"
            >
              Not {pendingAccount?.displayName || pendingAccount?.email}?
            </button>
            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-[#1a73e8] hover:bg-[#1765cc] text-white text-[14px] font-medium py-2.5 disabled:opacity-60"
              disabled={busy}
            >
              {busy ? 'Verifying...' : 'Sign in'}
            </button>
          </form>
        )}

        {/* Create password step (brand new account) */}
        {step === 'create-password' && (
          <form onSubmit={onCreatePassword} className="px-8 pb-2">
            <p className="text-[13px] text-[#5f6368] mb-3">
              First time signing in here — create a password to secure this account.
            </p>
            <label className="block text-[13px] text-[#5f6368] mb-1.5" htmlFor="google-new-password">
              Create a password
            </label>
            <input
              id="google-new-password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-lg border border-[#dadce0] px-3.5 py-2.5 text-[15px] text-[#1f1f1f] outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
            />
            <label className="block text-[13px] text-[#5f6368] mb-1.5 mt-3" htmlFor="google-confirm-password">
              Confirm password
            </label>
            <input
              id="google-confirm-password"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Re-enter password"
              className="w-full rounded-lg border border-[#dadce0] px-3.5 py-2.5 text-[15px] text-[#1f1f1f] outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
            />
            {error && <p className="mt-2 text-[13px] text-[#d93025]">{error}</p>}
            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-[#1a73e8] hover:bg-[#1765cc] text-white text-[14px] font-medium py-2.5 disabled:opacity-60"
              disabled={busy}
            >
              {busy ? 'Creating...' : 'Create & continue'}
            </button>
            <button
              type="button"
              onClick={onNotYou}
              className="mt-3 w-full text-center text-[13px] text-[#1a73e8] font-medium py-1"
            >
              Back
            </button>
          </form>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e8eaed] mt-1">
          <button
            type="button"
            className="text-[13px] text-[#5f6368] hover:bg-[#f2f2f2] px-2 py-1 rounded disabled:opacity-60"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <span className="text-[12px] text-[#9aa0a6] font-mono tracking-wide">URBANEYE</span>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage({ onLogin }) {
  // view: 'signin' | 'signup' | 'forgot'
  const [view, setView] = useState('signin')

  // Sign in fields
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Sign up fields
  const [fullName, setFullName] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupRole, setSignupRole] = useState(ROLES[0])
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')
  const [showSignupPassword, setShowSignupPassword] = useState(false)

  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Google account chooser
  const [showGoogleChooser, setShowGoogleChooser] = useState(false)
  const [googleAccounts, setGoogleAccounts] = useState([])
  const [googleStep, setGoogleStep] = useState('chooser') // 'chooser' | 'email' | 'password' | 'create-password'
  const [pendingGoogleAccount, setPendingGoogleAccount] = useState(null) // { email, displayName }
  const [newGoogleEmail, setNewGoogleEmail] = useState('')
  const [googlePassword, setGooglePassword] = useState('')
  const [googlePasswordConfirm, setGooglePasswordConfirm] = useState('')
  const [googleError, setGoogleError] = useState('')
  const [connectingEmail, setConnectingEmail] = useState(null)

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setNotice('')
  }

  const handleSignIn = (e) => {
    if (e) e.preventDefault()
    const newErrors = {}
    if (!username.trim()) {
      newErrors.username = 'Enter your municipal username to continue.'
    }
    if (!password) {
      newErrors.password = 'Enter your password to continue.'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)
    setNotice('Verifying credentials...')

    setTimeout(() => {
      setIsLoading(false)
      const account = verifyCredentials(username, password)

      if (!account) {
        setErrors({ password: 'Incorrect username or password.' })
        setNotice('')
        return
      }

      setNotice('')
      if (onLogin) {
        onLogin({
          username: account.username,
          displayName: account.displayName,
          role: account.role
        })
      }
    }, 600)
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!fullName.trim()) newErrors.fullName = 'Enter your full name.'
    if (!signupUsername.trim()) newErrors.signupUsername = 'Choose a username.'
    if (!signupPassword) newErrors.signupPassword = 'Choose a password.'
    else if (signupPassword.length < 6) newErrors.signupPassword = 'Use at least 6 characters.'
    if (signupConfirm !== signupPassword) newErrors.signupConfirm = 'Passwords do not match.'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsLoading(true)
    setNotice('Creating your account...')

    setTimeout(() => {
      setIsLoading(false)
      try {
        const account = registerAccount({
          username: signupUsername,
          password: signupPassword,
          displayName: fullName,
          role: signupRole
        })
        setNotice('')
        if (onLogin) {
          onLogin({
            username: account.username,
            displayName: account.displayName,
            role: account.role
          })
        }
      } catch (err) {
        setNotice('')
        setErrors({ signupUsername: err.message || 'Could not create that account.' })
      }
    }, 600)
  }

  // NOTE: this is a simulated Google sign-in for the demo build — there's no
  // backend here to verify a real Google ID token. To go live, add
  // @react-oauth/google (or Google Identity Services) on the frontend and
  // verify the returned credential on a real backend, then call onLogin with
  // the verified profile instead of this mock. What IS real here: the device
  // "remembers" any Google profile that has signed in before, AND a password
  // is actually checked (verifyGoogleCredentials) before anyone gets in — a
  // brand-new email has to set a password first; a returning one has to get
  // it right.
  const resetGoogleFlow = () => {
    setNewGoogleEmail('')
    setGooglePassword('')
    setGooglePasswordConfirm('')
    setGoogleError('')
    setPendingGoogleAccount(null)
    setConnectingEmail(null)
  }

  const handleGoogleSignIn = () => {
    const remembered = getRememberedGoogleAccounts()
    setGoogleAccounts(remembered)
    resetGoogleFlow()
    setGoogleStep(remembered.length ? 'chooser' : 'email')
    setShowGoogleChooser(true)
  }

  const selectRememberedAccount = (acc) => {
    setPendingGoogleAccount(acc)
    setGooglePassword('')
    setGoogleError('')
    setGoogleStep('password')
  }

  const handleGoogleEmailNext = (e) => {
    e.preventDefault()
    const email = newGoogleEmail.trim()
    if (!email || !email.includes('@')) {
      setGoogleError('Enter a valid email address.')
      return
    }
    const existing = findAccount(email)
    setGoogleError('')
    if (existing && existing.provider === 'google') {
      setPendingGoogleAccount({ email, displayName: existing.displayName })
      setGooglePassword('')
      setGoogleStep('password')
    } else if (existing) {
      setGoogleError('That email is already registered as a municipal account, not Google.')
    } else {
      setPendingGoogleAccount({ email, displayName: null })
      setGooglePassword('')
      setGooglePasswordConfirm('')
      setGoogleStep('create-password')
    }
  }

  const handleGoogleVerifyPassword = (e) => {
    e.preventDefault()
    if (!googlePassword) {
      setGoogleError('Enter your password to continue.')
      return
    }
    setGoogleError('')
    setConnectingEmail(pendingGoogleAccount.email)
    setTimeout(() => {
      const account = verifyGoogleCredentials(pendingGoogleAccount.email, googlePassword)
      setConnectingEmail(null)
      if (!account) {
        setGoogleError('Wrong password. Try again.')
        return
      }
      rememberGoogleAccount({ email: account.email || account.username, displayName: account.displayName })
      setShowGoogleChooser(false)
      if (onLogin) {
        onLogin({ username: account.username, displayName: account.displayName, role: account.role })
      }
    }, 600)
  }

  const handleGoogleCreatePassword = (e) => {
    e.preventDefault()
    if (!googlePassword || googlePassword.length < 6) {
      setGoogleError('Use at least 6 characters.')
      return
    }
    if (googlePassword !== googlePasswordConfirm) {
      setGoogleError('Passwords do not match.')
      return
    }
    setGoogleError('')
    const email = pendingGoogleAccount.email
    const rawName = email.split('@')[0].replace(/[._]/g, ' ')
    const displayName = rawName.replace(/\b\w/g, (c) => c.toUpperCase())
    setConnectingEmail(email)
    setTimeout(() => {
      const account = upsertGoogleAccount({ email, displayName, password: googlePassword })
      rememberGoogleAccount({ email: account.email || account.username, displayName: account.displayName })
      setConnectingEmail(null)
      setShowGoogleChooser(false)
      if (onLogin) {
        onLogin({ username: account.username, displayName: account.displayName, role: account.role })
      }
    }, 600)
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    if (!username.trim()) {
      setErrors({ username: 'Enter your username to receive a reset link.' })
      setNotice('')
      return
    }
    setErrors({})
    setNotice('If that municipal account exists, a reset link has been sent.')
  }

  const switchToForgot = () => {
    setView('forgot')
    setErrors({})
    setNotice('')
    setShowPassword(false)
  }

  const switchToSignIn = () => {
    setView('signin')
    setErrors({})
    setNotice('')
  }

  const switchToSignUp = () => {
    setView('signup')
    setErrors({})
    setNotice('')
  }

  return (
    <main className="urban-shell">
      {/* Motion AI rotating ball video */}
      <div className="urban-media" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={globePoster}
          ref={(el) => {
            if (el) el.play().catch(() => {})
          }}
        >
          <source src={globeVideo} type="video/mp4" />
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260806_133255_956f653f-5d80-4b06-abd5-0f46c98b60fa.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div className="urban-scrim" aria-hidden="true" />

      {/* Top Header Navigation */}
      <header className="urban-nav">
        <div className="flex items-center gap-2.5">
          <span className="urban-logo font-sora font-[300] tracking-[0.22em] text-white">URBANEYE</span>
        </div>

        <button
          type="button"
          onClick={view === 'signup' ? switchToSignIn : switchToSignUp}
          className="urban-nav-cta font-mono"
        >
          {view === 'signup' ? 'Sign In Instead' : 'Create Account'} <ArrowUpRight size={13} />
        </button>
      </header>

      {/* Main Form Body - centered */}
      <div className="urban-body">
        <div className="urban-panel flex flex-col items-center text-center">

          {/* Status Chip */}
          <div className="urban-chip font-mono">
            [ {view === 'signup' ? 'New Account' : 'Secure Access'} ]
          </div>

          <p className="urban-kicker font-mono mt-4">
            WE SPOT IT BEFORE YOU HIT IT.
          </p>

          <h1 className="font-sora">URBANEYE</h1>

          <p className="urban-tagline font-mono">
            Your city. In focus.
          </p>

          {view === 'signin' && (
            <form onSubmit={handleSignIn} className="urban-form w-full text-left mt-2">
              {/* Username Field */}
              <div className={`urban-field ${errors.username ? 'has-error' : ''}`}>
                <UserRound size={16} strokeWidth={1.4} aria-hidden="true" />
                <label className="sr-only" htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    clearError('username')
                  }}
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                />
              </div>

              {errors.username && (
                <p className="urban-error font-mono" id="username-error" role="alert">
                  {errors.username}
                </p>
              )}

              {/* Password Field */}
              <div className={`urban-field mt-3 ${errors.password ? 'has-error' : ''}`}>
                <Lock size={16} strokeWidth={1.4} aria-hidden="true" />
                <label className="sr-only" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    clearError('password')
                  }}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  className="urban-visibility"
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={1.4} />
                  ) : (
                    <Eye size={16} strokeWidth={1.4} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="urban-error font-mono" id="password-error" role="alert">
                  {errors.password}
                </p>
              )}

              {/* Meta Checkbox & Forgot Password */}
              <div className="urban-form-meta font-mono">
                <label className="urban-check-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="urban-checkmark" aria-hidden="true" />
                  Keep me signed in
                </label>

                <button
                  className="urban-text-link font-mono"
                  type="button"
                  onClick={switchToForgot}
                >
                  Forgot your password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                className="urban-button urban-button-solid"
                type="submit"
                disabled={isLoading}
              >
                <span>
                  {isLoading ? 'SIGNING IN...' : 'Sign in to URBANEYE'}
                </span>
                <ArrowUpRight size={15} strokeWidth={1.6} />
              </button>

              <div className="urban-divider font-mono" role="separator">
                <span>OR</span>
              </div>

              <button
                type="button"
                className="urban-button-google font-mono"
                onClick={handleGoogleSignIn}
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              {notice && (
                <p className="urban-notice font-mono" role="status">
                  {notice}
                </p>
              )}

              <p className="urban-switch-line font-mono">
                New to URBANEYE?{' '}
                <button type="button" className="urban-text-link font-mono" onClick={switchToSignUp}>
                  Create an account
                </button>
              </p>
            </form>
          )}

          {view === 'signup' && (
            <form onSubmit={handleSignUp} className="urban-form w-full text-left mt-2">
              {/* Full Name */}
              <div className={`urban-field ${errors.fullName ? 'has-error' : ''}`}>
                <IdCard size={16} strokeWidth={1.4} aria-hidden="true" />
                <label className="sr-only" htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    clearError('fullName')
                  }}
                />
              </div>
              {errors.fullName && <p className="urban-error font-mono">{errors.fullName}</p>}

              {/* Username */}
              <div className={`urban-field mt-3 ${errors.signupUsername ? 'has-error' : ''}`}>
                <UserRound size={16} strokeWidth={1.4} aria-hidden="true" />
                <label className="sr-only" htmlFor="signupUsername">Username</label>
                <input
                  id="signupUsername"
                  name="signupUsername"
                  type="text"
                  autoComplete="username"
                  placeholder="Choose a username"
                  value={signupUsername}
                  onChange={(e) => {
                    setSignupUsername(e.target.value)
                    clearError('signupUsername')
                  }}
                />
              </div>
              {errors.signupUsername && <p className="urban-error font-mono">{errors.signupUsername}</p>}

              {/* Role */}
              <div className="urban-field mt-3">
                <ShieldCheck size={16} strokeWidth={1.4} aria-hidden="true" />
                <label className="sr-only" htmlFor="signupRole">Role</label>
                <select
                  id="signupRole"
                  name="signupRole"
                  className="urban-select"
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div className={`urban-field mt-3 ${errors.signupPassword ? 'has-error' : ''}`}>
                <Lock size={16} strokeWidth={1.4} aria-hidden="true" />
                <label className="sr-only" htmlFor="signupPassword">Password</label>
                <input
                  id="signupPassword"
                  name="signupPassword"
                  type={showSignupPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={signupPassword}
                  onChange={(e) => {
                    setSignupPassword(e.target.value)
                    clearError('signupPassword')
                  }}
                />
                <button
                  className="urban-visibility"
                  type="button"
                  onClick={() => setShowSignupPassword((prev) => !prev)}
                  aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignupPassword ? <EyeOff size={16} strokeWidth={1.4} /> : <Eye size={16} strokeWidth={1.4} />}
                </button>
              </div>
              {errors.signupPassword && <p className="urban-error font-mono">{errors.signupPassword}</p>}

              {/* Confirm Password */}
              <div className={`urban-field mt-3 ${errors.signupConfirm ? 'has-error' : ''}`}>
                <Lock size={16} strokeWidth={1.4} aria-hidden="true" />
                <label className="sr-only" htmlFor="signupConfirm">Confirm password</label>
                <input
                  id="signupConfirm"
                  name="signupConfirm"
                  type={showSignupPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  value={signupConfirm}
                  onChange={(e) => {
                    setSignupConfirm(e.target.value)
                    clearError('signupConfirm')
                  }}
                />
              </div>
              {errors.signupConfirm && <p className="urban-error font-mono">{errors.signupConfirm}</p>}

              <button
                className="urban-button urban-button-solid mt-4"
                type="submit"
                disabled={isLoading}
              >
                <span>{isLoading ? 'CREATING ACCOUNT...' : 'Create account'}</span>
                <ArrowUpRight size={15} strokeWidth={1.6} />
              </button>

              <div className="urban-divider font-mono" role="separator">
                <span>OR</span>
              </div>

              <button
                type="button"
                className="urban-button-google font-mono"
                onClick={handleGoogleSignIn}
              >
                <GoogleIcon />
                <span>Sign up with Google</span>
              </button>

              {notice && (
                <p className="urban-notice font-mono" role="status">
                  {notice}
                </p>
              )}

              <p className="urban-switch-line font-mono">
                Already have an account?{' '}
                <button type="button" className="urban-text-link font-mono" onClick={switchToSignIn}>
                  Sign in
                </button>
              </p>
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={handleResetPassword} className="urban-form w-full text-left mt-2">
              <div className={`urban-field ${errors.username ? 'has-error' : ''}`}>
                <UserRound size={16} strokeWidth={1.4} aria-hidden="true" />
                <label className="sr-only" htmlFor="reset-username">Username</label>
                <input
                  id="reset-username"
                  name="reset-username"
                  type="text"
                  autoComplete="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    clearError('username')
                  }}
                />
              </div>

              {errors.username && (
                <p className="urban-error font-mono" role="alert">
                  {errors.username}
                </p>
              )}

              <button className="urban-button urban-button-solid" type="submit">
                <span>Send Reset Link</span>
                <ArrowRight size={15} strokeWidth={1.6} />
              </button>

              {notice && (
                <p className="urban-notice font-mono" role="status">
                  {notice}
                </p>
              )}

              <button
                type="button"
                onClick={switchToSignIn}
                className="urban-text-link font-mono mt-3"
              >
                Back to sign in
              </button>
            </form>
          )}

          {/* Encrypted Note */}
          <div className="urban-panel-note font-mono">
            <ShieldCheck size={15} strokeWidth={1.4} aria-hidden="true" />
            <span>Encrypted city intelligence access</span>
          </div>

        </div>
      </div>

      {showGoogleChooser && (
        <GoogleAccountChooser
          step={googleStep}
          accounts={googleAccounts}
          pendingAccount={pendingGoogleAccount}
          newEmail={newGoogleEmail}
          setNewEmail={setNewGoogleEmail}
          password={googlePassword}
          setPassword={setGooglePassword}
          passwordConfirm={googlePasswordConfirm}
          setPasswordConfirm={setGooglePasswordConfirm}
          error={googleError}
          connectingEmail={connectingEmail}
          onSelectAccount={selectRememberedAccount}
          onAddAccount={() => {
            setGoogleError('')
            setNewGoogleEmail('')
            setGoogleStep('email')
          }}
          onEmailNext={handleGoogleEmailNext}
          onVerifyPassword={handleGoogleVerifyPassword}
          onCreatePassword={handleGoogleCreatePassword}
          onNotYou={() => {
            setGoogleError('')
            setPendingGoogleAccount(null)
            setGoogleStep(googleAccounts.length ? 'chooser' : 'email')
          }}
          onBackToChooser={() => {
            setGoogleError('')
            setGoogleStep('chooser')
          }}
          onClose={() => {
            if (!connectingEmail) setShowGoogleChooser(false)
          }}
        />
      )}
    </main>
  )
}
