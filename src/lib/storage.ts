const PET_KEY = 'webpet_pet_data'
const USER_KEY = 'webpet_user'

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveJSON<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export function loadPetData<T>(fallback: T): T {
  return loadJSON(PET_KEY, fallback)
}

export function savePetData<T>(data: T): void {
  saveJSON(PET_KEY, data)
}

export function loadUser<T>(fallback: T): T {
  return loadJSON(USER_KEY, fallback)
}

export function saveUser<T>(data: T): void {
  saveJSON(USER_KEY, data)
}

export function clearUserData(): void {
  localStorage.removeItem(PET_KEY)
  localStorage.removeItem(USER_KEY)
}
