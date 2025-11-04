<script>
	import favicon from '$lib/assets/favicon.svg';

	let { data, children } = $props();

	if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log('Service worker registered'))
      .catch((err) => console.error('Service worker registration failed:', err));
  }
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.({data})}
