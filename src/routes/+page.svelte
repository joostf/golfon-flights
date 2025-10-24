<script>
  import { onMount } from 'svelte'
	import { enhance } from '$app/forms'

	let { form, data } = $props()

	// state
  //let flights = $state(JSON.parse(JSON.stringify(data.flights)))
  let flights = $derived(data.flights)
	let allUsers = $state(data.users || [])
	let golfCourses = $state(data.golf_courses || [])
  let golfCourse = $state(data.golfcourse.course || {})
  let randomGiphy = data.randomGiphy
	let selectedUsers = $state([])
  let editingFlight = $state(null)

	// modal / form references & mode
	let addFlightDialog
  let userMessageDialog
	let formEl
	let mode = $state('create') // 'create' | 'edit'
  let showMessage = $state(!!form?.message)
  
  function toggleMode() {
    mode = (mode === 'edit' ? 'create' : 'edit')
  }

  $effect(() => {
    if (form?.message) {
      showMessage = true
      toggleModal(true, userMessageDialog)
      const timer = setTimeout(() => {
        showMessage = false
        toggleModal(false, userMessageDialog)
      }, 2000)
      return () => clearTimeout(timer)
    }
  })

	// helpers
	function toggleModal(force, dialog) {
		if (force === true || !dialog.open) {
			dialog.showModal()
			document.body.style.overflow = 'hidden'
		} else {
			dialog.close()
			document.body.style.overflow = ''
			mode = 'create'
			editingFlight = null
		}
	}

	function openCreateModal() {
		mode = 'create'
		editingFlight = null
		toggleModal(true , addFlightDialog)
	}

	function openEditModal(flight) {
		// clone to avoid mutating original until server confirms
		mode = 'edit'
    editingFlight = JSON.parse(JSON.stringify(flight))
		toggleModal(true, addFlightDialog)
		// preselect users locally in the select (selected attribute handled in markup)
	}

  function isExpired(date) {
		const flightDate = new Date(date)
		const tomorrow = new Date()

		// Set "tomorrow" to tomorrow at 00:00
		tomorrow.setDate(tomorrow.getDate() + 1)
		tomorrow.setHours(0, 0, 0, 0)
		
		// Normalize the flight date for date-only comparison
		flightDate.setHours(0, 0, 0, 0)

		return flightDate < tomorrow
	}
</script>

<div class="wrapper">
	<header>
		<h1>Golfon flights</h1>

		<button onclick={openCreateModal}><span>Nieuwe flight</span><i>⛳️</i></button>
    <button class="secondary" onclick={toggleMode}>
      <span>{mode === 'edit' ? 'Stop bewerken' : 'Bewerk Flights'}</span> 
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
    </button>

		<dialog bind:this={addFlightDialog} class="add-flight-dialog">
			<form
				bind:this={formEl} 
				method="POST" 
				action={mode === 'create' ? '?/addFlight' : '?/editFlight'} 
				class="add-flight" 
        use:enhance
			>
				<h2>{mode === 'create' ? 'Nieuwe flight toevoegen' : 'Flight bewerken'}</h2>

				{#if mode === 'edit'}
					<input type="hidden" name="flight_id" value={editingFlight?.id} />
				{/if}

				<label for="date">Datum</label>
				<input
					type="date"
					name="date"
					id="date"
					required
					value={mode === 'edit' ? editingFlight?.date : ''}
				/>

				<label for="time">Tijd</label>
				<input
					type="time"
					name="time"
					id="time"
					required
					value={mode === 'edit' ? editingFlight?.time : ''}
				/>

				<label for="golf_course_id">Golfbaan</label>
				<select name="golf_course_id" id="golf_course_id" required>
					{#each golfCourses as course}
						<option
							value={course.id}
							selected={mode === 'edit' && editingFlight?.golf_course_id === course.id}
						>
							{course.name}
						</option>
					{/each}
				</select>

				<label for="user_ids">Spelers</label>
				<select name="user_ids" id="user_ids" multiple size="5" required>
					{#each allUsers as user}
						<!-- when editing, preselect if user is in editingFlight.flight_users -->
						<option
							value={user.id}
							selected={
								mode === 'edit' &&
								editingFlight?.flight_users?.some(fu => fu.user_id === user.id)
							}
						>
							{user.first_name} {user.last_name}
						</option>
					{/each}
				</select>
				<em>Houd Ctrl <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-windows"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17.8 20l-12 -1.5c-1 -.1 -1.8 -.9 -1.8 -1.9v-9.2c0 -1 .8 -1.8 1.8 -1.9l12 -1.5c1.2 -.1 2.2 .8 2.2 1.9v12.1c0 1.2 -1.1 2.1 -2.2 1.9z" /><path d="M12 5l0 14" /><path d="M4 12l16 0" /></svg><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 13v5c0 1.57 -1.248 2.832 -2.715 2.923l-.113 .003l-.042 .018a1 1 0 0 1 -.336 .056l-.118 -.008l-4.676 -.585v-7.407zm-10 0v7.157l-5.3 -.662c-1.514 -.151 -2.7 -1.383 -2.7 -2.895v-3.6zm0 -9.158v7.158h-8v-3.6c0 -1.454 1.096 -2.648 2.505 -2.87zm10 2.058v5.1h-8v-7.409l4.717 -.589c1.759 -.145 3.283 1.189 3.283 2.898" /> of ⌘ <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-apple"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8.286 7.008c-3.216 0 -4.286 3.23 -4.286 5.92c0 3.229 2.143 8.072 4.286 8.072c1.165 -.05 1.799 -.538 3.214 -.538c1.406 0 1.607 .538 3.214 .538s4.286 -3.229 4.286 -5.381c-.03 -.011 -2.649 -.434 -2.679 -3.23c-.02 -2.335 2.589 -3.179 2.679 -3.228c-1.096 -1.606 -3.162 -2.113 -3.75 -2.153c-1.535 -.12 -3.032 1.077 -3.75 1.077c-.729 0 -2.036 -1.077 -3.214 -1.077z" /><path d="M12 4a2 2 0 0 0 2 -2a2 2 0 0 0 -2 2" /></svg> ingedrukt om meerdere golfers te selecteren.</em>

				<footer>
					<button type="submit">
						<span>{mode === 'create' ? 'Toevoegen' : 'Opslaan'}</span>
						{#if mode === 'create'}
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-golf"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 3a1 1 0 0 1 1.496 -.868l7 4a1 1 0 0 1 0 1.736l-6.496 3.712v6.42a1 1 0 0 1 -.883 .993l-.117 .007a1 1 0 0 1 -1 -1z" /><path d="M14.135 17.168a1 1 0 0 1 1.367 -.363c.916 .532 1.498 1.291 1.498 2.195c0 1.84 -2.319 3 -5 3s-5 -1.16 -5 -3c0 -.911 .577 -1.66 1.498 -2.195a1 1 0 1 1 1.004 1.73c-.365 .212 -.502 .39 -.502 .465c0 .086 .179 .296 .622 .518c.6 .3 1.456 .482 2.378 .482s1.777 -.182 2.378 -.482c.443 -.222 .622 -.432 .622 -.518c0 -.07 -.142 -.256 -.502 -.465a1 1 0 0 1 -.363 -1.367" /></svg>
						{:else}
							<!-- edit icon -->
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-pencil"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3l7 7" /><path d="M3 21l6 -2 9 -9" /></svg>
						{/if}
					</button>

					<button type="button" onclick={() => toggleModal(false, addFlightDialog)}>
						<span>Sluiten</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-input-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 13v-4a2 2 0 0 0 -2 -2h-12a2 2 0 0 0 -2 2v5a2 2 0 0 0 2 2h7" /><path d="M22 22l-5 -5" /><path d="M17 22l5 -5" /></svg>
					</button>
				</footer>
			</form>
		</dialog>
	</header>

	<main>
		<h2 class="visually-hidden">Flights</h2>

		{#each flights as flight (flight.id)}
      {#if isExpired(flight.date)}
        <!-- Expired flight: collapsed by default -->
        <article class:expired={isExpired(flight.date)}>
          <details>
            <summary>
              <h3>
                {flight.golf_courses.name}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-lock"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" /><path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M8 11v-4a4 4 0 1 1 8 0v4" /></svg>
              </h3> 
              <p>{flight.pretty_date} {flight.pretty_time}</p>
            </summary>
            <ul>
              {#each flight.flight_users as flightUser}
                <li>
                  🏌🏼‍♂️ {flightUser.users.first_name} {flightUser.users.last_name}
                  <!-- No edit/remove buttons -->
                </li>
              {/each}
            </ul>
          </details>
        </article>
      {:else}
        <!-- Active flight: full editable card -->
        <article class="flight">
          <header>
            <div>
              <h3>{flight.golf_courses.name}</h3>
              <p>{flight.pretty_date} - {flight.pretty_time}</p>
            </div>

            {#if mode === 'edit'}
            <div class="flight-actions">
              <button type="button" onclick={() => openEditModal(flight)}>
                <span>Bewerken</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
              </button>
              <form method="POST" action="?/deleteFlight" use:enhance>
                <input type="hidden" name="flight_id" value={flight.id} />
                <button type="submit" title="Verwijder flight">
                  <span>Verwijder</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                </button>
              </form>
            </div>
            {/if}
          </header>
          <ul>
            {#each flight.flight_users as flightUser}
              <li>
                🏌🏼‍♂️ {flightUser.users.first_name} {flightUser.users.last_name}

                <form method="POST" action="?/removeUserFromFlight" use:enhance>
                  <input type="hidden" name="flight_id" value={flight.id} />
                  <input type="hidden" name="user_id" value={flightUser.user_id} />
                  <button type="submit">
                    <span class="visually-hidden">Verwijder</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>  
                  </button>
                </form>
              </li>
            {/each}
          </ul>
        </article>
      {/if}
    {/each}

    <footer>
      <button>
        <span>Download alle flights</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-xls"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" /><path d="M4 15l4 6" /><path d="M4 21l4 -6" /><path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" /><path d="M11 15v6h3" /></svg>
      </button>
    </footer>
	</main>

  <aside>
    <div> 
      <h2>{randomGiphy.data.title}</h2>
      <img src="https://media.giphy.com/media/{randomGiphy.data.id}/giphy.gif" alt="{randomGiphy.data.title}">

      <!-- randomGiphy.data.id -->
    </div>

    <div>
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
    </div>

    
  </aside>

  <dialog bind:this={userMessageDialog} >
    {#if showMessage}
      <p class:success={form?.success} class:error={form?.error}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-message-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9h8" /><path d="M8 13h6" /><path d="M10.99 19.206l-2.99 1.794v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6" /><path d="M15 19l2 2l4 -4" /></svg>
        {form?.message}
      </p>
    {/if}
  </dialog> 
</div>

<style>
  div.wrapper {
    display:grid;
    gap:1rem;
    grid-template-columns: 1fr;
    

    @container (min-width: 35em){
      grid-template-columns: 2fr 1fr; 
      max-width:85rem;
    }
  }

  div > header {
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
    justify-content: flex-start;
    flex-wrap:wrap;
    gap:1rem;
    align-items: center;

    h1 {
      font-size:1.5rem;
      font-weight: normal;
      width:100%;
      margin-bottom: -.75rem;

      @container (min-width: 35em) {
        width:auto;
        font-size: 2.5em;
        margin: 0;
      }
    }

    dialog {
      top:1rem;
      border-radius:.5rem;
      padding:1.5rem;
      border-color: var(--default-colors);
      font-size: .9em;

      @container (min-width: 35em) {
        max-width:40vw;
        top:4rem;
      }

      h2 {
        font-weight: bold;
      }
    }

    button {
      border-radius:.5rem;
      position: relative;
      line-height: 2.5;
      position: relative;

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

    > button:first-of-type {
      padding-right: 3.5rem;
      margin-left:auto;
    }
  }

  main {
    display:grid;
    align-items: start;
    gap:1rem;
    grid-template-columns: 1fr;
    grid-auto-rows: max-content; 

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
            margin-left:auto;
          }

          :focus-visible,
          :hover {
            background-color: var(--primary-color);
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

    footer {
      z-index:100;
      padding:0;

      button {
        --shadow-color:oklch(55.534% 0.09481 194.807);
        background-color: oklch(0.8 0.14 195.36);
        border-radius:.5rem;
        gap:.25rem;

      }
    }
  }

  aside {
    padding:0;
    min-width:200px;
    display:flex;
    flex-direction: column;
    gap:2rem;

    div {
      display:flex;
      flex-direction: column;
    }
    
    h2 {
      font-weight: bold;
      margin-bottom: .5rem;
    }
  }

  div.wrapper > dialog {
    border-radius:.5rem;
    padding:2rem;
    background:rgba(255, 255, 255, .8);
    border:1px solid var(--default-color);
    outline:none;
    width:fit-content;

    p {
      font-size: 1.5em;
      position: relative;
      padding-left: 2.5rem;

      svg {
        position: absolute;
        left:0;
      }
    }
  }
</style>

<!-- https://superforms.rocks/ -->