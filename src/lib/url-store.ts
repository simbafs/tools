// src/lib/url-store.ts

// Custom event name for state updates not triggered by popstate
const EVENT_NAME = 'url-store-update'

/**
 * Encodes data to a URL-safe Base64 string.
 * Handles UTF-8 characters properly.
 */
function encode<T>(data: T): string {
	try {
		return btoa(encodeURIComponent(JSON.stringify(data)))
	} catch (e) {
		console.error('Failed to encode data for URL:', e)
		return ''
	}
}

/**
 * Decodes data from a URL-safe Base64 string.
 * Handles UTF-8 characters properly.
 */
function decode<T>(str: string): T | null {
	try {
		return JSON.parse(decodeURIComponent(atob(str)))
	} catch (e) {
		console.error('Failed to decode data from URL:', e)
		return null
	}
}

/**
 * Computes the diff between current and default values.
 * Returns only the keys where values differ from defaults.
 * For non-object types, returns the current value if it differs from default.
 */
function getDiff<T>(current: T, defaults: T): Partial<T> {
	// Handle primitives and null
	if (typeof current !== 'object' || current === null) {
		if (current !== defaults) {
			return { value: current } as unknown as Partial<T>
		}
		return {} as Partial<T>
	}

	const diff: Partial<T> = {}

	for (const key of Object.keys(current) as Array<keyof T>) {
		const currentValue = current[key]
		const defaultValue = defaults[key]

		// Deep comparison for objects
		if (
			currentValue !== defaultValue &&
			JSON.stringify(currentValue) !== JSON.stringify(defaultValue)
		) {
			(diff as Record<string, unknown>)[key as string] = currentValue
		}
	}

	return diff
}

/**
 * A generic store that syncs state with the URL hash fragment.
 * Only saves values that differ from defaults (sparse saving).
 * Supports listening to changes via .subscribe()
 */
export class URLStore<T> {
	private defaultValue: T

	constructor(defaultValue: T) {
		this.defaultValue = defaultValue
	}

	/**
	 * Reads the current state from the URL hash.
	 * Merges saved diff with default values.
	 * Returns the default value if hash is empty or parsing fails.
	 */
	get(): T {
		if (typeof window === 'undefined') {
			return this.defaultValue
		}

		const hash = window.location.hash.slice(1) // remove leading '#'

		if (!hash) {
			return this.defaultValue
		}

		const decoded = decode<Partial<T>>(hash)

		if (decoded === null) {
			return this.defaultValue
		}

		// Handle primitives (wrapped in { value: ... })
		const isPrimitive = typeof this.defaultValue !== 'object' && this.defaultValue !== null
		if (isPrimitive) {
			return (decoded as { value?: T }).value ?? this.defaultValue
		}

		// Merge defaults with saved diff
		return { ...this.defaultValue, ...decoded }
	}

	/**
	 * Updates the URL hash with the diff (only non-default values).
	 * If all values are default, clears the hash.
	 * @param data The new state to save.
	 * @param pushHistory If true, creates a new history entry (pushState). If false, replaces the current entry (replaceState). Default: false.
	 */
	set(data: T, pushHistory = false): void {
		if (typeof window === 'undefined') return

		// Compute diff: only values different from defaults
		const diff = getDiff(data, this.defaultValue)

		// If all values are default, clear the hash
		if (Object.keys(diff).length === 0) {
			this.clear(pushHistory)
			return
		}

		const encoded = encode(diff)
		const url = new URL(window.location.href)
		url.hash = encoded

		if (pushHistory) {
			window.history.pushState({}, '', url.toString())
		} else {
			window.history.replaceState({}, '', url.toString())
		}

		// Dispatch custom event for in-page updates
		window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }))
	}

	/**
	 * Clears the state from the URL hash.
	 * @param pushHistory If true, creates a new history entry (pushState). If false, replaces the current entry (replaceState). Default: false.
	 */
	clear(pushHistory = false): void {
		if (typeof window === 'undefined') return

		const url = new URL(window.location.href)
		url.hash = ''
		if (pushHistory) {
			window.history.pushState({}, '', url.toString())
		} else {
			window.history.replaceState({}, '', url.toString())
		}

		// Dispatch custom event for in-page updates
		window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: this.defaultValue }))
	}

	/**
	 * Subscribes to state changes.
	 * The callback is invoked when:
	 * 1. The URL is updated via .set() (custom event)
	 * 2. The user navigates back/forward (popstate event)
	 *
	 * @returns A function to unsubscribe.
	 */
	subscribe(callback: (data: T) => void): () => void {
		if (typeof window === 'undefined') {
			return () => { }
		}

		const handleCustomEvent = (event: Event) => {
			const customEvent = event as CustomEvent
			callback(customEvent.detail)
		}

		const handlePopState = () => {
			callback(this.get())
		}

		window.addEventListener(EVENT_NAME, handleCustomEvent)
		window.addEventListener('popstate', handlePopState)

		return () => {
			window.removeEventListener(EVENT_NAME, handleCustomEvent)
			window.removeEventListener('popstate', handlePopState)
		}
	}
}
