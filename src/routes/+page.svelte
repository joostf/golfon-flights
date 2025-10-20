<script>
  import removeUserFromFlight from '$lib/utils/flights/removeUser'
  import addUserToFlight from '$lib/utils/flights/addUsers'
  import getAvailableUsers from '$lib/utils/flights/getAvailableUsers'
  import isExpired from '$lib/utils/flights/isExpired'

  let { data } = $props()

  let flights = $state(structuredClone(data.flights))
  let allUsers = $state(data.users || [])
  let golfCourse = $state(data.golfcourse.course || {})
  let selectedUsers = $state([])
</script>

<div class="wrapper">
  <header>
    <h1 class="svelte-1uha8ag">Golfon flights </h1>
    <button>⛳️</button>
  </header>

  <main>
    {#each flights as flight}
      <form class:expired={isExpired(flight.date)}>
        <h2>{flight.golf_courses.name}</h2>
        <p>{flight.pretty_date} - {flight.pretty_time}</p>

        <ul>
          {#each flight.flight_users as flightUser}
            <li>
              🏌🏼‍♂️ {flightUser.users.first_name}
              <button onClick={() => removeUserFromFlight(flight.id, flightUser.user_id)}>
                <span class="visually-hidden">Verwijder</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 7l16 0"></path><path d="M10 11l0 6"></path><path d="M14 11l0 6"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg>
              </button>
            </li>
          {/each}

          {#if flight.flight_users.length < 4}
            {#each Array(4 - flight.flight_users.length) as _, index}
              <li>
                <select bind:value={selectedUsers[index]}>
                  <option value="">Kies golfer</option>
                  {#each getAvailableUsers(flight.flight_users, allUsers) as user}
                    <option value={user.id}>{user.first_name}</option>
                  {/each}
                </select>

                <button onClick={() => addUserToFlight(flight.id, selectedUsers[index], allUsers)} disabled={!selectedUsers[index]}>
                  <span class="visually-hidden">Voeg golfer toe</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-users-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path><path d="M3 21v-2a4 4 0 0 1 4 -4h4c.96 0 1.84 .338 2.53 .901"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path><path d="M16 19h6"></path><path d="M19 16v6"></path></svg>
                </button>
              </li>
            {/each}
          {/if}
        </ul>
      </form>
    {/each}
  </main>

  <!-- <aside>
    <h2>{golfCourse.course_name} {golfCourse.tees.male[1].tee_name} Tees <small>({golfCourse.tees.male[1].total_yards} yards)</small></h2>
    <table>
      <thead>
        <tr>
          <td>Par</td>
          <td>Yards</td>
          <td>SR</td>
        </tr>
      </thead>

      <tbody>
      {#each golfCourse.tees.male[1].holes as hole}
        <tr>
          <td>{hole.par}</td>
          <td>{hole.yardage}</td>
          <td>{hole.handicap}</td>
        </tr>
      {/each}
      </tbody>
    </table>
  </aside> -->
</div>

<style>
  div {
    display:grid;
    gap:1rem;
    grid-template-columns: 1fr;

    @container (min-width: 35em){
      grid-template-columns: 2fr 1fr; 
    }
    
  }
  header {
    position: fixed;
    height: 5rem;
    top:0;
    left:0;
    width:calc(100% - 3rem);
    z-index:100;
    padding:0 1.5rem;
    background:rgb(255, 255, 255, .8);
    border-bottom:1px solid oklch(1% 0.31 241);
    display:flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    font-weight: normal;
  }

  header button {
    font-size: 2.5em;
    background-color: transparent;

    &:focus-visible {
      scale: 1.1;
    } 
  }

  main {
    display:grid;
    justify-items: left;
    gap:1rem;
    grid-template-columns: 1fr; 
  }

  form {
    padding:0;
    font-size: 1.5em;
    border:1px solid oklch(1% 0.31 241);
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
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    margin-bottom: 0;
    padding-bottom:.5rem;
    
    overflow-x: auto;

    @container (min-width: 25em) {
        flex-direction: row;
        align-items: flex-start;
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
    min-width:fit-content;
  }

  button {
    border-radius:50%;
    aspect-ratio:1;
    border-color:transparent;
    transition:.25s;

    &:focus-visible {
      outline:none;
    }

    &:hover {
      cursor: pointer;
    }
  }

  li button:focus-visible,
  li button:hover {
    background-color: oklch(84% 0.3 330);
    
    svg {
      /color:#fff
    }
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