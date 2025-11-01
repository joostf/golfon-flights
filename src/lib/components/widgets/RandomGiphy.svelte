<script>
  import { enhance } from '$app/forms';
  import Icon from '$lib/components/ui/Icon.svelte';

  const { randomGiphy } = $props();

  let giphy = $state(randomGiphy?.data);
  let loading = $state(false);
</script>

<section>
  <h2>{giphy.title}</h2>

  <img
    src={`https://media.giphy.com/media/${giphy.id}/giphy.gif`}
    alt={giphy.title}
  />

  <form
    method="POST"
    action="/?/refreshGiphy"
    use:enhance={({ update }) => {
      loading = true;

      return async ({ result }) => {
        loading = false;

        if (result.type === 'success') {
          giphy = result.data.randomGiphy.data; // ✅ update local state
        }
      };
    }}
  >
    <button type="submit" disabled={loading} class="secondary">
      <span>{loading ? 'Laden...' : 'Nieuwe GIF'}</span>
      <Icon name="refresh" size="16" />
    </button>
  </form>
</section>


<style>
  section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  h2 {
    font-size: 1.25rem;
    margin: 0;
  }

  img {
    border-radius: 0.5rem;
    max-width: 100%;
  }
</style>





