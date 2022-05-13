import { derived } from 'svelte/store';

export default function(a, t){
	return derived(a, ($a, set) => {
        let timeoutId = setTimeout(() => set($a), t);
		return () => clearTimeout(timeoutId) 
	});
}