<script>
  import Icon from '$lib/components/ui/Icon.svelte'
  import { enhance } from '$app/forms'
  
  let { mode, onCreateFlight, onToggleMode, user } = $props()
</script>

<header>
  <h1>Golfon flights</h1>
  {#if user}
  <button onclick={onCreateFlight}>
    <span>Nieuwe flight</span>
    <i>⛳️</i>
  </button>
  <button class="secondary" onclick={onToggleMode}>
    <span>{mode === 'edit' ? 'Stop bewerken' : 'Bewerk flights'}</span>
    <Icon name="edit" />
  </button>
  {/if}
</header>

<!-- Login / Logout -->
<div class="login-container" class:no-user={!user}>
  {#if user}
    <form method="POST" action="?/logout" class="logout-form" data-sveltekit-reload data-sveltekit-preserve-scroll>
      <button type="submit">
        <span>Uitloggen</span>
        <Icon name="logout" size="16" />
      </button>
    </form>
  {:else}
    <form method="POST" action="?/login" class="login-form" data-sveltekit-reload data-sveltekit-preserve-scroll>
      <input
        type="password"
        name="password"
        placeholder="Wachtwoord"
        required
      />
      <button type="submit">
        <span>Inloggen</span>
        <Icon name="login" size="16" />
      </button>
    </form>
  {/if}
</div>

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

  .login-container {
    position: fixed;
    right: .5rem;
    bottom: .5rem;
    z-index:1000;


    form {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: .5rem;
      flex-wrap:nowrap;

      input {
        margin:0 0 0 auto;
        line-height: 2;
        height:2.35rem
      }
    }
  }
</style>