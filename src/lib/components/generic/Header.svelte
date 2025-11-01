<script>
  import Icon from '$lib/components/ui/Icon.svelte'
  let { mode, onCreateFlight, onToggleMode } = $props()
</script>

<header>
  <h1>Golfon flights</h1>
  <button onclick={onCreateFlight}>
    <span>Nieuwe flight</span>
    <i>⛳️</i>
  </button>
  <button class="secondary" onclick={onToggleMode}>
    <span>{mode === 'edit' ? 'Stop bewerken' : 'Bewerk Flights'}</span>
    <Icon name="edit" />
  </button>
</header>

<style>
  header {
    position: fixed;
    height: 5rem;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 200;
    padding: 0 var(--_spacing);
    background: rgb(255, 255, 255, .8);
    border-bottom: 1px solid var(--default-color);
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }

  header h1 {
    font-size: 1.5rem;
    font-weight: normal;
    width: 100%;
    margin-bottom: -.75rem;
  }

  @container (min-width: 35em) {
    header h1 {
      width: auto;
      font-size: 2.5em;
      margin: 0;
    }
  }

  header button {
    border-radius: .5rem;
    position: relative;
    line-height: 2.5;
    padding: 0 .5rem;
  }

  header button span {
    font-size: 1rem;
    padding-right: .5rem;
  }

  header button i {
    font-size: 3.75em;
    font-style: normal;
    position: absolute;
    right: .5rem;
    bottom: -1.75rem;
  }

  header > button:first-of-type {
    padding-right: 3.5rem;
    margin-left: auto;
  }
</style>