<script>
  export let data;

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
    flight.flight_users.push({ user_id: userId, users: user });
  }

  function getAvailableUsers(currentFlightUsers) {
    const usedIds = currentFlightUsers.map(fu => fu.user_id);
    return allUsers.filter(user => !usedIds.includes(user.id));
  }

  // --- Refactored to take a date string ---
  function isExpired(dateStr) {
    const flightDate = new Date(dateStr);
    const now = new Date();
    return flightDate < now;
  }
</script>

<header>
  <h1 class="svelte-1uha8ag">Golfon flights ⛳️</h1>
</header>

<main>
  {#each flights as flight}
    <!-- Now we pass the date directly -->
    <form class:expired={isExpired(flight.date)}>
      <h2>{flight.golf_courses.name}</h2>
      <p>{flight.pretty_date} - {flight.pretty_time}</p>

      <ul>
        {#each flight.flight_users as flightUser}
          <li>
            🏌🏼‍♂️ {flightUser.users.first_name}
            <button on:click={() => removeUserFromFlight(flight.id, flightUser.user_id)}>
              <span class="visually-hidden">Verwijder</span>
              <!-- SVG omitted -->
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
    grid-template-columns: 1fr; 
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
    flex-direction:column;
    gap:.5rem;
    margin-bottom: 0;

    @media (min-width:30em) {
      flex-direction: row;
    }
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

  .expired {
    opacity: 0.25;
    background-color: #ffe6e6;
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