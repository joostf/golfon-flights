<script>
  const { mode, flight, users, golf_courses, onClose } = $props();
</script>

<dialog open class="flight-dialog">
  <form method="POST" action={mode === 'create' ? '?/addFlight' : '?/editFlight'} use:enhance>
    {#if mode === 'edit'}
      <input type="hidden" name="flight_id" value={flight.id} />
    {/if}

    <label>Datum</label>
    <input type="date" name="date" required value={mode==='edit'?flight.date:''}/>

    <label>Tijd</label>
    <input type="time" name="time" required value={mode==='edit'?flight.time:''}/>

    <label>Golfbaan</label>
    <select name="golf_course_id" required>
      {#each golf_courses as gc}
        <option value={gc.id} selected={mode==='edit' && flight.golf_course_id===gc.id}>{gc.name}</option>
      {/each}
    </select>

    <label>Spelers</label>
    <select name="user_ids" multiple required>
      {#each users as u}
        <option value={u.id} selected={mode==='edit' && flight.flight_users?.some(fu=>fu.user_id===u.id)}>
          {u.first_name} {u.last_name}
        </option>
      {/each}
    </select>

    <footer>
      <button type="submit">{mode==='create'?'Toevoegen':'Opslaan'} <Icon name={mode==='create'?'golf':'edit'} size="24"/></button>
      <button type="button" on:click={onClose}>Sluiten <Icon name="close" size="24"/></button>
    </footer>
  </form>
</dialog>

<style>
.flight-dialog { padding:1rem; border:none; border-radius:1rem; }
form { display:flex; flex-direction:column; gap:.5rem; }
footer { display:flex; gap:.5rem; margin-top:1rem; }
</style>
