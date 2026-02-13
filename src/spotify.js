/**
 * Spotify Web API: PKCE auth + search + create playlist.
 * Set VITE_SPOTIFY_CLIENT_ID in .env
 * Add Redirect URI in Spotify Dashboard: https://kaich1k.github.io/Jammming/ (and optionally http://127.0.0.1:5173/)
 */

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = typeof window !== 'undefined'
  ? window.location.origin + (import.meta.env.BASE_URL || '/')
  : 'https://kaich1k.github.io/Jammming/'
const SCOPES = [
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private',
].join(' ')

const CODE_VERIFIER_KEY = 'spotify_code_verifier'
const TOKEN_KEY = 'spotify_access_token'

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(values, (x) => possible[x % possible.length]).join('')
}

async function sha256Base64Url(plain) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Redirect to Spotify login (PKCE). After login, user returns with ?code=... */
export function login() {
  if (!CLIENT_ID) {
    console.error('Missing VITE_SPOTIFY_CLIENT_ID in .env')
    return
  }
  const codeVerifier = generateRandomString(64)
  sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier)
  sha256Base64Url(codeVerifier).then((codeChallenge) => {
    const url = new URL('https://accounts.spotify.com/authorize')
    url.searchParams.set('client_id', CLIENT_ID)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('redirect_uri', REDIRECT_URI)
    url.searchParams.set('scope', SCOPES)
    url.searchParams.set('code_challenge_method', 'S256')
    url.searchParams.set('code_challenge', codeChallenge)
    window.location.href = url.toString()
  })
}

/** Exchange ?code=... for access token. Call on the page that loads after redirect. */
export async function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (!code) return null
  const codeVerifier = sessionStorage.getItem(CODE_VERIFIER_KEY)
  if (!codeVerifier) return null
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  })
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  const data = await res.json()
  if (data.error) {
    console.error('Spotify token error', data)
    return null
  }
  sessionStorage.removeItem(CODE_VERIFIER_KEY)
  return data.access_token
}

export function setStoredToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token)
  else sessionStorage.removeItem(TOKEN_KEY)
}

export function getStoredToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(CODE_VERIFIER_KEY)
}

async function fetchWebApi(token, endpoint, method = 'GET', body = null) {
  const opts = {
    headers: { Authorization: `Bearer ${token}` },
    method,
  }
  if (body) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }
  const res = await fetch(`https://api.spotify.com/${endpoint}`, opts)
  if (res.status === 401) return { _unauthorized: true }
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/** Search tracks. Returns { tracks: { items } } or { _unauthorized: true } */
export async function searchTracks(token, query, limit = 20) {
  if (!query.trim()) return { tracks: { items: [] } }
  const q = encodeURIComponent(query.trim())
  const data = await fetchWebApi(token, `v1/search?q=${q}&type=track&limit=${limit}`, 'GET')
  if (data && data._unauthorized) return data
  return data || { tracks: { items: [] } }
}

/** Get current user. Returns { id, ... } or { _unauthorized: true } */
export async function getMe(token) {
  return fetchWebApi(token, 'v1/me', 'GET')
}

/** Create playlist. Returns { id, ... } or { _unauthorized: true } */
export async function createPlaylist(token, userId, name, description = '') {
  return fetchWebApi(token, `v1/users/${userId}/playlists`, 'POST', {
    name,
    description: description || 'Created with Jammming',
    public: true,
  })
}

/** Add tracks to playlist. uris = ['spotify:track:id', ...] */
export async function addTracksToPlaylist(token, playlistId, uris) {
  if (!uris.length) return null
  return fetchWebApi(token, `v1/playlists/${playlistId}/tracks`, 'POST', { uris })
}
