<script>
  import Icon from '$lib/components/ui/Icon.svelte'
  import { confirmFormSubmit } from '$lib/utils/form.js'
  import { enhance } from '$app/forms'

  let { flight, mode, isExpired, onEdit, user } = $props()

  function handleDeleteFlight(flightId) {
    console.log('Delete flight:', flightId)
  }

  function handleRemoveUser(flightId, userId) {
    console.log('Remove user:', userId, 'from flight:', flightId)
  }

  const formConfigs = {
    deleteFlight: {
      message: 'Weet je zeker dat je deze flight wilt verwijderen?',
      action: (flight) => handleDeleteFlight(flight.id)
    },
    removeUser: {
      message: 'Weet je zeker dat je deze speler wilt verwijderen?',
      action: (flight, user) => handleRemoveUser(flight.id, user.user_id)
    }
  }
</script>

{#if isExpired(flight.date)}
  <article class:expired={isExpired(flight.date)} class="flight" data-date={flight.date}>
    <details>
      <summary>
        <h3>
          {flight.golf_courses.name}
          <Icon name="locked" size="24" />
        </h3>
        <p>{flight.pretty_date} {flight.pretty_time}</p>
      </summary>
      <ul>
        {#each flight.flight_users as flightUser}
          <li>
            🏌🏼‍♂️ {flightUser.users.first_name} {flightUser.users.last_name}
          </li>
        {/each}
      </ul>
    </details>
  </article>
{:else}
  <article class="flight" data-date={flight.date}>
    <header>
      <div>
        <h3>{flight.golf_courses.name}</h3>
        <p>{flight.pretty_date} - {flight.pretty_time}</p>
      </div>

      {#if mode === 'edit' && user}
        <div class="flight-actions">
          <button type="button" onclick={() => onEdit(flight)}>
            <span>Bewerken</span>
            <Icon name="edit" size="16" />
          </button>   

          <!-- Delete Flight Form -->
          <form
            method="POST"
            action="?/deleteFlight"
            use:enhance={confirmFormSubmit(
              formConfigs.deleteFlight.message,
              () => formConfigs.deleteFlight.action(flight)
            )}
          >
            <input type="hidden" name="flight_id" value={flight.id} />
            <button type="submit" title="Verwijder flight">
              <span>Verwijder</span>
              <Icon name="trash" size="16" />
            </button>
          </form>
        </div>
      {/if}
    </header>

    <ul>
      {#each flight.flight_users as flightUser}
        <li>
          🏌🏼‍♂️ {flightUser.users.first_name} {flightUser.users.last_name}
          {#if user}
          <!-- Remove User Form -->
          <form
            method="POST"
            action="?/removeUserFromFlight"
            use:enhance={confirmFormSubmit(
              formConfigs.removeUser.message,
              () => formConfigs.removeUser.action(flight, flightUser)
            )}
          >
            <input type="hidden" name="flight_id" value={flight.id} />
            <input type="hidden" name="user_id" value={flightUser.user_id} />
            <button type="submit" title="Verwijder speler">
              <span class="visually-hidden">Verwijder</span>
              <Icon name="trash" size="16" />
            </button>
          </form>
          {/if}
        </li>
      {/each}
    </ul>
  </article>
{/if}

<style>
article {
  font-size: 1.5em;
  border:1px solid var(--default-color);
  border-radius:.5rem;
  padding:var(--_spacing);
  background:rgb(255, 255, 255, .6);
  position:relative;

  div {
    display:flex;
    flex-direction: column;
  }

  ul {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    margin-bottom: -.5rem;
    padding-bottom:1rem;
    overflow-x: auto;

    @container (min-width: 45em) {
        flex-direction: row;
        align-items: flex-start;
    }

    li {
      list-style: none;
      display: flex;
      gap: .25rem;
      align-items: center; 
      justify-content: start;
      background-color: #fff;
      border-radius:.5rem;
      padding:.25rem;
      min-width:fit-content;

      form {
        margin-left: auto;
      }

      button {
        --shadow-size:1px;
        --shadow-color:rgba(0, 0, 0, .1);
        background-color: #f0f0f0;
        aspect-ratio:1;
        border-radius: 50%;
        margin-left:auto;
      }

      :focus-visible,
      :hover {
        background-color: var(--primary-color);
        border-radius: 50%;
        translate: 0 0;
        
      }
    }
  }

  header .flight-actions {
    position:absolute;
    right:1rem;
    top:1rem;
    display:flex;
    flex-direction: row;
    gap:.5rem;

    form {
      display:flex;
      background-color: transparent;
    }

    button {
      --shadow-color:oklch(55.534% 0.09481 194.807);
      background-color: oklch(0.8 0.14 195.36);
      border-radius: .25rem;
      display:flex;
      gap:.25rem;
    }
  }
}

article.expired {
  opacity:.3;
}
</style>