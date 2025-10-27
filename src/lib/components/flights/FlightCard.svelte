<script>
  const { flight, mode, onEdit, onRemoveUser } = $props();
</script>

<article class:expired={flight.expired}>
  <header>
    <div>
      <h3>{flight.golf_courses.name}</h3>
      <p>{flight.pretty_date} - {flight.pretty_time}</p>
    </div>

    {#if mode === 'edit'}
    <div class="flight-actions">
      <button type="button" onclick={() => onEdit(flight)}>
        <span>Bewerken</span>
        <Icon name="edit" size="16" />
      </button>

      {#each flight.flight_users as fu}
      <form method="POST" action="?/removeUserFromFlight" use:enhance>
        <input type="hidden" name="flight_id" value={flight.id} />
        <input type="hidden" name="user_id" value={fu.user_id} />
        <button type="submit" onclick={() => onRemoveUser(flight, fu)}>
          <span class="visually-hidden">Verwijder</span>
          <Icon name="trash" size="16" />
        </button>
      </form>
      {/each}
    </div>
    {/if}
  </header>

  <ul>
    {#each flight.flight_users as fu}
      <li>🏌🏼‍♂️ {fu.users.first_name} {fu.users.last_name}</li>
    {/each}
  </ul>
</article>

<style>
article { border:1px solid #ccc; padding:1rem; border-radius:0.5rem; margin-bottom:1rem; }
.expired { opacity:0.3; }
.flight-actions { display:flex; gap:.5rem; margin-top:.5rem; }
</style>
