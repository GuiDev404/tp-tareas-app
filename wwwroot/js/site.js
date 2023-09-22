const adminPanel = document.getElementById('admin-panel')
const btnToggle = document.getElementById('btn-toggle')
const listTasks = document.getElementById('list-task')

btnToggle.addEventListener('click', function (){
  adminPanel.classList.toggle('hide')
})
console.log(listTasks);

listTasks.addEventListener('click', function (e){
  e.preventDefault();

  const item = e.target.closest('.list-group-item')

  if(item){
    alert(item.querySelector('strong').innerText)
  }
})


