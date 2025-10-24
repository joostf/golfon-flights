<script>
  import { enhance } from '$app/forms'
  import removeUserFromFlight from '$lib/utils/flights/removeUser'
  import addUserToFlight from '$lib/utils/flights/addUsers'
  import getAvailableUsers from '$lib/utils/flights/getAvailableUsers'
  import isExpired from '$lib/utils/flights/isExpired'

  let { form, data } = $props()

  let flights = $state(structuredClone(data.flights))
  let allUsers = $state(data.users || [])
  let golfCourse = $state(data.golfcourse.course || {})
  let selectedUsers = $state([])

  let dialog

  function toggleModal(force) {
		if (force === true || !dialog.open) {
			dialog.showModal()
		} else {
			dialog.close()
		}
	}
</script>

<div class="wrapper">
  <header>
    <h1>Golfon flights</h1>
    <button onclick={() => toggleModal(true)}><span>Nieuwe flight</span><i>⛳️</i></button>

    <dialog bind:this={dialog}>
      <form method="POST" action="?/addFlight">
        <h2>Nieuwe flight toevoegen</h2>

        <label for="date">Datum</label>
        <input type="date" name="date" id="date" required />
        
        <label for="time">Tijd</label>
        <input type="time" name="time" id="time" required />
        
        <label for="golf_course_id">Golfbaan</label>        
        <select name="golf_course_id" id="golf_course_id" required>
          {#each data.golf_courses as course}
            <option value={course.id}>{course.name}</option>
          {/each}
        </select>
        
        <label for="user_ids">Spelers</label>
        <select name="user_ids" id="user_ids" multiple size="5" required>
          {#each data.users as user}
            <option value={user.id}>{user.first_name} {user.last_name}</option>
          {/each}
        </select>
        <small>Houd Ctrl (Windows) of ⌘ (Mac) ingedrukt om meerdere golfers te selecteren.</small>
        
        <footer>
          <button type="submit">
            <span>Flight toevoegen</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-golf"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 3a1 1 0 0 1 1.496 -.868l7 4a1 1 0 0 1 0 1.736l-6.496 3.712v6.42a1 1 0 0 1 -.883 .993l-.117 .007a1 1 0 0 1 -1 -1z" /><path d="M14.135 17.168a1 1 0 0 1 1.367 -.363c.916 .532 1.498 1.291 1.498 2.195c0 1.84 -2.319 3 -5 3s-5 -1.16 -5 -3c0 -.911 .577 -1.66 1.498 -2.195a1 1 0 1 1 1.004 1.73c-.365 .212 -.502 .39 -.502 .465c0 .086 .179 .296 .622 .518c.6 .3 1.456 .482 2.378 .482s1.777 -.182 2.378 -.482c.443 -.222 .622 -.432 .622 -.518c0 -.07 -.142 -.256 -.502 -.465a1 1 0 0 1 -.363 -1.367" /></svg>
          </button>
          <button type="button" onclick={() => toggleModal(false)}>
            <span>Sluit venster</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-input-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 13v-4a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v5a2 2 0 0 0 2 2h7" /><path d="M22 22l-5 -5" /><path d="M17 22l5 -5" /></svg>
          </button>
        </footer>
        
      </form>
    </dialog>
  </header>

  <main>
    <h2 class="visually-hidden">FLights</h2>
    {#each flights as flight}
      <form class:expired={isExpired(flight.date)}>
        <h3>{flight.golf_courses.name}</h3>
        <p>{flight.pretty_date} - {flight.pretty_time}</p>

        <ul>
          {#each flight.flight_users as flightUser}
            <li>
              🏌🏼‍♂️ {flightUser.users.first_name}
              <button onclick={() => removeUserFromFlight(flights, flight.id, flightUser.user_id)}>
                <span class="visually-hidden">Verwijder</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 7l16 0"></path><path d="M10 11l0 6"></path><path d="M14 11l0 6"></path><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg>
              </button>
            </li>
          {/each}

          {#if flight.flight_users.length < 4}
            {#each Array(4 - flight.flight_users.length) as _, index}
              <li>
                🏌🏼‍♂️ <select bind:value={selectedUsers[index]}>
                  <option value="">Kies golfer</option>
                  {#each getAvailableUsers(flight.flight_users, allUsers) as user}
                    <option value={user.id}>{user.first_name}</option>
                  {/each}
                </select>

                <button onclick={() => addUserToFlight(flight.id, selectedUsers[index], allUsers)} disabled={!selectedUsers[index]}>
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

  <aside>
    <h2>Memory lane</h2>
    <details>
      <summary><h3>{golfCourse.course_name} {golfCourse.tees.male[1].tee_name} Tees <small>({golfCourse.tees.male[1].total_yards} yards)</small></h3></summary>
      <table>
        <thead>
          <tr>
            <td>Par</td>
            <td>Yards</td>
            <td>SI</td>
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
      
    </details>
    
    <h2>Random gif</h2>
    <img src="/giphy.gif" alt="Jimenez moonwalk">

  </aside>

  <footer>
    <button>
      <span>Download alle flights</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-xls"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M4 15l4 6" /><path d="M4 21l4 -6" /><path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" /><path d="M11 15v6h3" /></svg>
    </button>
  </footer>
</div>

<style>
  div {
    display:grid;
    gap:1rem;
    grid-template-columns: 1fr;
    

    @container (min-width: 35em){
      grid-template-columns: 2fr 1fr; 
      max-width:85rem;
    }
  }

  button {
    --shadow-size:2px;
    --shadow-color:oklch(73.351% 0.26585 327.856);
    font-family: inherit;
    border-radius:50%;
    color:var(--default-color);
    
    border-color:transparent;
    transition:.25s;
    box-shadow: var(--shadow-size) var(--shadow-size) 0 0px var(--shadow-color);

    &:focus-visible,
    &:hover {
      outline:none;
      translate: var(--shadow-size) var(--shadow-size);
      box-shadow: none;
    } 

    &:hover {
      cursor: pointer;
    }
  }

  header {
    position: fixed;
    height: 5rem;
    top:0;
    left:0;
    width:100vw;
    z-index:200;
    padding:0 var(--_spacing);
    background:rgb(255, 255, 255, .8);
    border-bottom:1px solid var(--default-color);
    display:flex;
    justify-content: space-between;
    align-items: center;

    h1 {
      font-size:1.5rem;
      font-weight: normal;

      @container (min-width: 35em) {
        font-size: 2.5em;
      }
    }

    dialog {
      top:6rem;
      height:calc(100vh - 12rem);
      overflow-y:auto;
      border-radius:.5rem;
      padding:1.5rem;
      border-color: var(--default-colors);
      font-size: .9em;
    }

    dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.8);
    }

    form {
      display:flex;
      flex-direction: column;
      background-color: #fff;
      padding:0;
      border:none;

      @container (min-width: 35em) {
        width:50vw;
      }

      label {
        margin-bottom: .5rem;
      }

      input, select {
        margin-bottom: 1rem;
        border-width:1px;
      }
      select[multiple] {
        min-height:11rem;
      }
      small {
        font-size: .85rem;
        margin-bottom: 1rem;
      }
      button {
        padding-right:.5rem;

        span {
          font-size: 1rem;
          padding-right: 0;
        }

        svg {
          translate: 0 .25rem;
        }
      }
    }
  }

  h2 {
    font-size: 1.25em;
    font-weight: normal;
    margin: 0 0 1rem;
  }

  header button,
  footer button {
    border-radius:.5rem;
    position: relative;
    padding-right: 3.5rem;
    line-height: 2.5;
    position: relative;
    background: var(--secondary-color);

    span {
      font-size: 1rem;
      padding-right: .5rem;
    }

    i {
      font-size:3.75em;
      font-style: normal;
      position: absolute;
      right:.5rem;
      bottom:-1.75rem;
      
    }
  }

  main {
    display:grid;
    align-items: start;
    gap:1rem;
    grid-template-columns: 1fr;
    grid-auto-rows: max-content; 
  }

  form {
    font-size: 1.5em;
    border:1px solid var(--default-color);
    border-radius:.5rem;
    padding:var(--_spacing);
    background:rgb(255, 255, 255, .6);
  }

  h3, p  {
    margin:0;
  }

  h3 {
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
    }

    li button {
      --shadow-size:1px;
      --shadow-color:rgba(0, 0, 0, .1);
      aspect-ratio:1;
      margin-left:auto;
    }

    li button:focus-visible,
    li button:hover {
      background-color: var(--primary-color);
    }
  }

  input,
  select {
    font-size: inherit;
    font-family: inherit;
    color:inherit;
    border-color:var(--default-color);
    border-radius:.5rem;
    margin:0 -.25rem;
    padding:0 .2rem;
    flex-grow:.8;

    /* display:none; */
  }

  .expired {
    opacity: 0.25;
    background-color: #ffe6e6;
  }

  summary {
    position: relative;
  }

  summary::marker {
    content: "👇🏻";
  }

  aside {
    padding:1em;
    min-width:200px;
  }

  aside h2 {
    font-weight: bold;
  }

 aside > *:not(h2) {
  margin-bottom: 2rem;
 }

  

  details[open] summary::marker {
    content: "👆🏼";
  }

  table {
    border: 1px solid;
    padding:.5rem;
    border-radius: .5rem;
    background-color: var(--secondary-color);
  }

  td {
    padding:.25rem 1.5rem;
  }

  details[open] table {
    animation: animateDown 0.2s linear forwards;
  }

  @keyframes animateDown {
    0% {
      opacity: 0;
      transform: translatey(35px);
    }
    100% {
      opacity: 1;
      transform: translatey(0);
    }
  }

  div > footer {
  position: fixed;
  height: 5rem;
  bottom: 0;
  left:0;
  width:100vw;
  z-index:100;
  padding:0 var(--_spacing);

  button {
    --shadow-color:oklch(55.534% 0.09481 194.807);
    background-color: oklch(0.8 0.14 195.36);
    padding-right: 0;
    position: absolute;
    right:var(--_spacing);
    bottom:var(--_spacing);
   
    

    svg {
      translate: -.5rem .25rem;
    }
  }
}
</style>