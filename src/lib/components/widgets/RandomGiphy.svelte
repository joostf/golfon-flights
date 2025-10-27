<script>
  import { enhance } from '$app/forms';
  import Icon from '$lib/components/ui/Icon.svelte';

  const { randomGiphy } = $props();
  let giphy = $derived(randomGiphy?.data);
  let formEl

  let loading = $state(false);
</script>

<section class="random-giphy">
  <h2>{giphy.title}</h2>
  <img src={"https://media.giphy.com/media/" + giphy.id + "/giphy.gif"} alt={giphy.title} />

  <form method="POST" use:enhance action="/?/refreshGiphy" bind:this={formEl}>
    <button type="submit" disabled={loading}>
      <span>{loading ? 'Laden...' : 'Ververs GIF'}</span>
      <Icon name="refresh" size="16" />
    </button>
  </form>
</section>

<style>
  .random-giphy {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .random-giphy img {
    border-radius: 0.5rem;
    max-width: 100%;
  }

  .random-giphy h2 {
    font-size: 1.25rem;
    margin: 0;
  }
</style>





