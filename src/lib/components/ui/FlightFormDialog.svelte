<script>
  import Icon from '$lib/components/ui/Icon.svelte'
  import { enhance } from '$app/forms'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  const { open = false, mode, editingFlight, golfCourses, allUsers } = $props()

  let dialog

  $effect(() => {
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
      document.body.style.overflow = ''
    }
  })

  function close(e) {
    dispatch('close')
  }
</script>

<dialog bind:this={dialog} class="flight-form-dialog">
  <form
    method="POST"
    action={mode === 'create' ? '?/addFlight' : '?/editFlight'}
    class="add-flight"
    use:enhance={({ formElement, formData, action, cancel, submitter }) => {
      // show loading state, disable inputs, etc. here if needed

      return async ({ result, update }) => {
        // hide loading state, enable inputs, etc. here if needed
        await update()
        if (result.type === 'success') {
          close()
        }
      }
    }}
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
    
    <em>Houd Ctrl <!-- SVG icons --> ingedrukt om meerdere golfers te selecteren.</em>
    
    <footer>
      <button type="submit">
        <span>{mode === 'create' ? 'Toevoegen' : 'Opslaan'}</span>
        {#if mode === 'create'}
          <Icon name="create" size="24" />
        {:else}
          <Icon name="edit" size="24" />
        {/if}
      </button>
      <button type="button" onclick={close}>
        <span>Sluiten</span>
        <Icon name="edit" size="24" />
      </button>
    </footer>
  </form>
</dialog>

<style>
  dialog {
    top: 1rem;
    border-radius: .5rem;
    padding: 1.5rem;
    border-color: var(--default-colors);
    font-size: .9em;
  }

  @container (min-width: 35em) {
    dialog {
      max-width: 40vw;
      top: 4rem;
    }
  }

  dialog h2 {
    font-weight: bold;
  }
</style>