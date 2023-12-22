const adminPanel = document.getElementById('admin-panel')
const btnToggle = document.getElementById('btn-toggle')

btnToggle?.addEventListener('click', function (){
  adminPanel.classList.toggle('hide')
})
