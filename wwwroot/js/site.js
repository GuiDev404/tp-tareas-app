const adminPanel = document.getElementById('admin-panel')
const btnsToggle = document.querySelectorAll('#btn-toggle, #btn-hide-admin-panel');

[...btnsToggle]?.forEach(btn=> {
  btn.addEventListener('click', function (){
    adminPanel.classList.toggle('admin-panel-hide')
  })
}) 

const contenidoVacioListaTareas = ({ text = 'No hay tareas' } = {})=> ` 
  <div class="d-flex flex-column justify-content-center h-100 align-items-center d-none text-muted" id="no-results">
    <svg width="50" height="50" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 3h10a2 2 0 0 1 2 2v10m0 4a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14" />
      <path d="M11 7h4" />
      <path d="M9 11h2" />
      <path d="M9 15h4" />
      <path d="M3 3l18 18" />
    </svg>
    <p class=" lead text-center"> ${text} </p>
  </div>
`