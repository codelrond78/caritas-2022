<script>
	import debounced from '../lib/debounce'
	import { writable } from 'svelte/store';

	let a = writable(0);
	const delayed = debounced(a, 1000);
</script>

<button on:click={()=>$a++}>
	a++
</button>
{$delayed}