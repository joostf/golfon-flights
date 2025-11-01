<script>
  import Icon from '$lib/components/ui/Icon.svelte'
  import RandomGiphy from '$lib/components/widgets/RandomGiphy.svelte'
  import MemoryLane from '$lib/components/widgets/MemoryLane.svelte'
  import FlightCard from '$lib/components/flights/FlightCard.svelte'
  import FlightFormDialog from '$lib/components/ui/FlightFormDialog.svelte'
  import MessageDialog from '$lib/components/ui/MessageDialog.svelte'
  import Header from '$lib/components/generic/Header.svelte'
  import { onMount } from 'svelte'


  let { form, data } = $props()
  
  // state
  let flights = $derived(data.flights)
  let allUsers = $state(data.users || [])
  let golfCourses = $state(data.golf_courses || [])
  let golfCourse = $state(data.golfcourse.course || {})
  let randomGiphy = data.randomGiphy
  let selectedUsers = $state([])
  let editingFlight = $state(null)
  let addFlightDialogOpen = $state(false)
  let userMessageDialogOpen = $state(false)
  let showMessage = $state(false)

  
  // modal / form references & mode
  let addFlightDialog
  let formEl
  let mode = $state('create') // 'create' | 'edit'

  // helpers
  $effect(() => {
    if (form?.message) {
      showMessage = true;
      const timer = setTimeout(() => {
        showMessage = false;
      }, 2000);
      return () => clearTimeout(timer);
    }
  });

  function toggleMode() {
    mode = (mode === 'edit' ? 'create' : 'edit');
  }

  function openCreateModal() {
    mode = 'create';
    editingFlight = null;
    addFlightDialogOpen = true;
  }

  function openEditModal(flight) {
    mode = 'edit';
    editingFlight = JSON.parse(JSON.stringify(flight));
    addFlightDialogOpen = true;
  }

  function closeFlightFormDialog() {
    addFlightDialogOpen = false;
  }

  function closeMessageDialog() {
    userMessageDialogOpen = false;
  }

  function isExpired(date) {
    const flightDate = new Date(date)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    flightDate.setHours(0, 0, 0, 0)
    return flightDate < tomorrow
  }
</script>

<div class="wrapper">
  <Header
    {mode}
    onCreateFlight={openCreateModal}
    onToggleMode={toggleMode}
  />
  
  <main>
    <h2 class="visually-hidden">Flights</h2>
    {#each flights as flight (flight.id)}
      <FlightCard 
        {flight}
        {mode}
        {isExpired}
        onEdit={openEditModal}
      />
    {/each}
    
    <footer>
      <button>
        <span>Download alle flights</span>
        <Icon name="excel" size="24" />
      </button>
    </footer>
  </main>

  <aside>
    <RandomGiphy {randomGiphy} />
    <MemoryLane {golfCourse} />
  </aside>

  <FlightFormDialog 
    open={addFlightDialogOpen}
    on:close={closeFlightFormDialog}
    {mode}
    {editingFlight}
    {golfCourses}
    {allUsers}
  />

  <MessageDialog 
    open={showMessage}
    {form}
    on:close={closeMessageDialog}
  />
</div>

<style>
  /* Only layout and wrapper styles remain here */
  div.wrapper {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
  }

  @container (min-width: 35em) {
    div.wrapper {
      grid-template-columns: 2fr 1fr;
      max-width: 85rem;
    }
  }

  main {
    display: grid;
    align-items: start;
    gap: 1rem;
    grid-template-columns: 1fr;
    grid-auto-rows: max-content;
  }

  main footer {
    z-index: 100;
    padding: 0;
  }

  main footer button {
    --shadow-color: oklch(55.534% 0.09481 194.807);
    background-color: oklch(0.8 0.14 195.36);
    border-radius: .5rem;
    gap: .25rem;
  }

  aside {
    padding: 0;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
</style>