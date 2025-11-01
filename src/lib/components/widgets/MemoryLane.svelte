<script>
  const { golfCourse } = $props();
</script>

<section>
  <h2>Memory lane</h2>
  <details>
    <summary>
      <h3>{golfCourse.course_name} {golfCourse.tees.male[1].tee_name} Tees 
        <small>({golfCourse.tees.male[1].total_yards} yards)</small>
      </h3>
    </summary>

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
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  table {
    border: 1px solid;
    border-radius: 0.5rem;
    background-color: var(--secondary-color);
    width: 100%;
  }

  td {
    padding: 0.25rem 1.5rem;
  }

  details summary {
    cursor: pointer;
    list-style: none;
  }

  details summary::before {
    content: " ";
    background: url("/caret-down.svg") no-repeat center / contain;
    position: absolute;
    right: 0;
    top: -0.25rem;
    height: 1.5rem;
    width: 1.5rem;
    transform-origin: 50% 50%;
    transition: transform 0.2s;
  }

  details[open] summary::before {
    transform: rotate(180deg);
  }
</style>

