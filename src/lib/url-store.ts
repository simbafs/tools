// src/lib/url-store.ts

// The query parameter name where all data is stored.
const QUERY_PARAM = 'q';

// Custom event name for state updates not triggered by popstate
const EVENT_NAME = 'url-store-update';

/**
 * Encodes data to a URL-safe Base64 string.
 * Handles UTF-8 characters properly.
 */
function encode<T>(data: T): string {
	try {
		return btoa(encodeURIComponent(JSON.stringify(data)));
	} catch (e) {
		console.error('Failed to encode data for URL:', e);
		return '';
	}
}

/**
 * Decodes data from a URL-safe Base64 string.
 * Handles UTF-8 characters properly.
 */
function decode<T>(str: string): T | null {
	try {
		return JSON.parse(decodeURIComponent(atob(str)));
	} catch (e) {
		console.error('Failed to decode data from URL:', e);
		return null;
	}
}

/**
 * A generic store that syncs state with the URL query parameter.
 * Supports listening to changes via .subscribe()
 */
export class URLStore<T> {
	private defaultValue: T;

	constructor(defaultValue: T) {
		this.defaultValue = defaultValue;
	}

	/**
	 * Reads the current state from the URL.
	 * Returns the default value if parsing fails or parameter is missing.
	 */
	get(): T {
		if (typeof window === 'undefined') {
			return this.defaultValue;
		}

		const params = new URLSearchParams(window.location.search);
		const val = params.get(QUERY_PARAM);

		if (!val) {
			return this.defaultValue;
		}

		const decoded = decode<T>(val);
		return decoded !== null ? decoded : this.defaultValue;
	}

	/**
	 * Updates the URL with the new state.
	 * @param data The new state to save.
	 * @param pushHistory If true, creates a new history entry (pushState). If false, replaces the current entry (replaceState). Default: false.
	 */
	set(data: T, pushHistory = false): void {
		if (typeof window === 'undefined') return;

		const encoded = encode(data);
		const url = new URL(window.location.href);
		url.searchParams.set(QUERY_PARAM, encoded);

		if (pushHistory) {
			window.history.pushState({}, '', url.toString());
		} else {
			window.history.replaceState({}, '', url.toString());
		}

		// Dispatch custom event for in-page updates
		window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }));
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
			return () => {};
		}

		const handleCustomEvent = (event: Event) => {
			const customEvent = event as CustomEvent;
			callback(customEvent.detail);
		};

		const handlePopState = () => {
			callback(this.get());
		};

		window.addEventListener(EVENT_NAME, handleCustomEvent);
		window.addEventListener('popstate', handlePopState);

		// Initialize with current state immediately?
		// Usually subscribers want the current value right away.
		// However, standard stores often don't trigger on subscribe. 
		// Let's assume the consumer calls .get() for initial render.
		
		return () => {
			window.removeEventListener(EVENT_NAME, handleCustomEvent);
			window.removeEventListener('popstate', handlePopState);
		};
	}
}
