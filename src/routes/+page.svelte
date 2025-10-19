<script>
  export let data;

  console.log(data);
  

  let flights = structuredClone(data.flights);
  let allUsers = data.users || [];
  let selectedUsers = [];

  function removeUserFromFlight(flightId, userId) {
    const flight = flights.find(f => f.id === flightId);
    if (!flight) return;

    flight.flight_users = flight.flight_users.filter(fu => fu.user_id !== userId);
  }

  function addUserToFlight(flightId, userId) {
    const flight = flights.find(f => f.id === flightId);
    if (!flight) return;

    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    flight.flight_users.push({
      user_id: userId,
      users: user
    });
  }

  function getAvailableUsers(currentFlightUsers) {
    const usedIds = currentFlightUsers.map(fu => fu.user_id);
    return allUsers.filter(user => !usedIds.includes(user.id));
  }
</script>

<header>
  <h1>Golfon flights ⛳️</h1>
</header>

<main>
  {#each flights as flight}
    <form>
      <h2>
        {flight.golf_courses.name} 
      </h2>
      <p>
        {flight.pretty_date} - {flight.pretty_time}
      </p>

      <ul>
        {#each flight.flight_users as flightUser}
          <li>
            🏌🏼‍♂️ {flightUser.users.first_name}
            <button on:click={() => removeUserFromFlight(flight.id, flightUser.user_id)}>
              <span class="visually-hidden">Verwijder</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
            </button>
          </li>
        {/each}

        {#if flight.flight_users.length < 4}
          {#each Array(4 - flight.flight_users.length) as _, index}
            <li>
              <select bind:value={selectedUsers[index]}>
                <option value="">-- Kies golfer --</option>
                {#each getAvailableUsers(flight.flight_users) as user}
                  <option value={user.id}>{user.first_name}</option>
                {/each}
              </select>

              <button
                on:click={() => addUserToFlight(flight.id, selectedUsers[index])}
                disabled={!selectedUsers[index]}
              >
                <span class="visually-hidden">Voeg golfer toe</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-users-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4c.96 0 1.84 .338 2.53 .901" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
              </button>
            </li>
          {/each}
        {/if}
      </ul>
    </form>
  {/each}
</main>


<style>
  h1 {
    font-weight: normal;
  }
  main {
    display:grid;
    justify-content: left;
    gap:1rem;
  }

  form {
    padding:0;
    font-size: 1.5em;
    border:1px solid;
    border-radius:.5rem;
    padding:1rem;
    background:rgb(255, 255, 255, .8);
  }

  h2, p  {
    margin:0;
  }

   h2 {
    font-weight: normal;
    font-size: 1.15em;
    margin-bottom: .5rem;
  }

  p::first-letter {
    text-transform: capitalize;
  }

  p {
    font-size: 0.8em;
  }

  ul {
    padding:0;
    display:flex;
    gap:.5rem;
    margin-bottom: 0;
  }

  li {
    list-style: none;
    display: flex;
    gap: 1rem;
    align-items: center; 
    justify-content: center;
    background-color: #fff;
    border-radius:.5rem;
    padding:.25rem;
    flex-wrap:nowrap;
    min-width:1em;
  }

  button {
    all:unset;
  }

  select {
    font-size: inherit;
    color:inherit;
    border-color:transparent;
    display:none;
  }
  
  .visually-hidden {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
  
</style>