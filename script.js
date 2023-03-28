
const body = document.querySelector("body");
const sidebar = body.querySelector(".sidebar");
const toggle = body.querySelector(".toggle");
const searchBtn = body.querySelector(".search-box");
const modeSwitch = body.querySelector(".toggle-switch");
const modeText = body.querySelector(".mode-text");
const inputs = document.querySelectorAll('.formulario input');
const modal = document.getElementById("modal");
const modalBtn = document.getElementById("show-modal");
const span = document.getElementsByClassName("close")[0];
const allLinks = document.querySelectorAll('a');
const form = document.querySelector('.formulario');
const table = document.querySelector('#myTable tbody');

// default button active
document.querySelector('a[href="#home"]').classList.add('active')

//handle close sidebar
toggle.addEventListener("click",()=>{
    sidebar.classList.toggle("close")
})
// handle dark mode
modeSwitch.addEventListener("click",()=>{
    body.classList.toggle("dark")
})

// Active link button
allLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        allLinks.forEach(otherLink => {
            if (otherLink !== link) {
              otherLink.classList.remove('active');
            }
          });
        this.classList.add('active');
    });
  });

// =================== GET data =================

async function getData() {
  const response = await fetch('https://protecciontotal.gt/Supervision/api_supervision.php?d=%272022-09-29%2000:00:00%27');
  const data = await response.json();
  const searchInput = document.getElementById('search');
  generatePieChart(data);
  document.getElementsByClassName("totalUsuarios")[0].textContent = `${data.length} usuarios`
  // Add an event listener to the search input to re-render the data when the user types
  searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    const filteredData = data.filter(item => {
      const usuario = item.usuario || '';
      return usuario.toLowerCase().includes(searchValue);
    });
    renderData(filteredData);
  });

  // Render the initial data
  renderData(data);
}

function renderData(data) {
  const tbody = document.querySelector('#data');
  tbody.innerHTML = '';

  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.clienteuuid}</td>
      <td>${item.usuario}</td>
      <td>${item.fecha}</td>
      <td>${item["CODIGO EMPLEADO"]}</td>
      <td>${item["UNIFORME BUENO"]}</td>
      <td>${item["UNIFORME REGULAR"]}</td>
      <td>${item["UNIFORME MALO"]}</td>
      <td>${item["EQUIPO BUENO"]}</td>
      <td>${item["EQUIPO REGULAR"]}</td>
      <td>${item["EQUIPO MALO"]}</td>
      <td>${item["COMUNICACION BUENO"]}</td>
      <td>${item["COMUNICACION REGULAR"]}</td>
      <td>${item["COMUNICACION MALO"]}</td>
      <td>${item['SUPERVISOR']}</td>
      <td>${item["EXISTE NOVEDAD"]}</td>
      <td>${item['ACCIONES']}</td>
      <td>${item["LISTA DE ARMAS"]}</td>
      <td>${item['SUCURSALES']}</td>
      <td>${item['OBSERVACIONES']}</td>
      <td>
        <button class="view">Ver <i class='bx bxs-bullseye'></i></button>
        <button class="edit" onClick="onEdit(this)">Editar <i class='bx bx-edit-alt'></i></button>
        <button class="delete" onclick="deleteRow(this)">Eliminar <i class='bx bx-trash'></i></button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

getData()

// =============== Modal =============================

// When the user clicks on the button, open the modal
modalBtn.onclick = function() {
  // showSnackbar("Registro agregado con éxito.")
  changeSubmitButtonContent("Agregar")
  enableInputs(inputs)
  showModal(modal)
}

hideModal(modal)
closeModalOutside(modal)
closeIconModal()

// ===================== CRUD =============================

form.addEventListener('submit', handleSubmit);


// ======================= View data =======================
document.addEventListener('click', function(event) {
  const row = event.target.closest('tr');
  if (event.target.classList.contains('view')) {
    const rowData = getRowData(row);
    fillForm(form, rowData);
    disableInputs(inputs);
    hideSubmitButton(form);
    showModal(modal);

    // ================ Edit data ======================
  }else if(event.target.classList.contains('edit')){
    const rowData = getRowData(row);
    fillForm(form, rowData);
    enableInputs(inputs);
    changeSubmitButtonContent("Editar")
    showSubmitButton(form);
    showModal(modal);
  }
});

function onEdit(button) {
  const row = button.parentElement.parentElement;
  row.classList.add('editingRow');
  document.getElementById("snackbar").textContent = "Registro editado exitosamente!"

}

// ============= Delete ============================

function deleteRow(button) {
  const row = button.parentElement.parentElement;
  document.getElementById("snackbar").textContent = "Registro eliminado exitosamente!"
  row.remove();
  snackbar.classList.add("show");
  setTimeout(function() {
    snackbar.classList.remove("show");
  }, 5000);
  
}



// ==========   data process functions =================
function getRowData(row) {
  const data = {};
  data.usuario = row.cells[1].textContent;
  data.fecha = row.cells[2].textContent;
  data.codigo = row.cells[3].textContent;
  data.ubueno = row.cells[4].textContent;
  data.uregular = row.cells[5].textContent;
  data.umalo = row.cells[6].textContent;
  data.ebueno = row.cells[7].textContent;
  data.eregular = row.cells[8].textContent;
  data.emalo = row.cells[9].textContent;
  data.cbuena = row.cells[10].textContent;
  data.cregular = row.cells[11].textContent;
  data.cmala = row.cells[12].textContent;
  data.supervisor = row.cells[13].textContent;
  data.novedades = row.cells[14].textContent;
  data.acciones = row.cells[15].textContent;
  data.armas = row.cells[16].textContent;
  data.sucursales = row.cells[17].textContent;
  data.observaciones = row.cells[18].textContent;
  return data;
}

function fillForm(form, data) {
  Object.entries(data).forEach(([key, value]) => {
    const input = form.elements[key];
    if (input) {
      input.value = value;
    }
  });
}

function disableInputs(inputs) {
  inputs.forEach(input => {
    input.readOnly = true;
  });
}

function enableInputs(inputs) {
  inputs.forEach(input => {
    input.readOnly = false;
  });
}

function showModal(modal) {
  modal.style.display = 'block';
  
}

function hideModal(modal) {
  modal.style.display = 'none';
  resetForm()
}

function hideSubmitButton(form) {
  const submitButton = form.querySelector('.submitBtn');
  if (submitButton) {
    submitButton.style.display = 'none';
  }
}

function showSubmitButton(form) {
  const submitButton = form.querySelector('.submitBtn');
  if (submitButton) {
    submitButton.style.display = 'block';
  }
}

function hideSubmitButton(form) {
  const submitButton = form.querySelector('.submitBtn');
  if (submitButton) {
    submitButton.style.display = 'none';
  }
}

function changeSubmitButtonContent(text){
  document.getElementsByClassName("submitBtn")[0].textContent = text
}

// ========== Id generator =================================
function generateUID() {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return `${s4()}-${s4()}-${s4()}-${s4()}`;
}

// =========   Reset form   ===========
function resetForm(){
  const form = document.querySelector('.formulario');
  const button = document.querySelector('.submitBtn');
  button.style.display = 'block';
  form.reset();
  inputs.forEach(input => {
    input.readOnly=false;
  });
}

function showSnackbar(message){
  const snackbar = document.getElementById("snackbar");
  snackbar.textContent = message
  snackbar.classList.add("show");
  setTimeout(function() {
    snackbar.classList.remove("show");
  }, 5000);
}


function closeModalOutside(modal){
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      resetForm()
    }
  }
}

function closeIconModal() {
  const span = document.querySelector('.close');
  span.onclick = function() {
    modal.style.display = "none";
  };
}

function createNewRow(data) {
  const newRow = table.insertRow(0);
  newRow.innerHTML = `
  <td>${generateUID()}</td>
  <td>${data.usuario}</td>
  <td>${data.fecha}</td>
  <td>${data.codigo}</td>
  <td>${data.ubueno}</td>
  <td>${data.uregular}</td>
  <td>${data.umalo}</td>
  <td>${data.ebueno}</td>
  <td>${data.eregular}</td>
  <td>${data.emalo}</td>
  <td>${data.cbuena}</td>
  <td>${data.cregular}</td>
  <td>${data.cmala}</td>
  <td>${data.supervisor}</td>
  <td>${data.novedades}</td>
  <td>${data.acciones}</td>
  <td>${data.armas}</td>
  <td>${data.sucursales}</td>
  <td>${data.observaciones}</td>
  <td>
  <button class="view">Ver <i class='bx bxs-bullseye'></i></button>
  <button class="edit" onClick="onEdit(this)">Editar <i class='bx bx-edit-alt'></i></button>
  <button class="delete" onclick="deleteRow(this)">Eliminar <i class='bx bx-trash'></i></button>
  </td>
  ...
  `;
  return newRow;
}

function getFormData(form) {
  return {
    usuario : form.elements.usuario.value,
    fecha : form.elements.fecha.value,
    codigo : form.elements.codigo.value,
    ubueno : form.elements.ubueno.value,
    uregular : form.elements.uregular.value,
    umalo : form.elements.umalo.value,
    ebueno : form.elements.ebueno.value,
    eregular : form.elements.eregular.value,
    emalo : form.elements.emalo.value,
    cbuena : form.elements.cbuena.value,
    cregular : form.elements.cregular.value,
    cmala : form.elements.cmala.value,
    supervisor : form.elements.supervisor.value,
    novedades : form.elements.novedades.value,
    acciones : form.elements.acciones.value,
    armas : form.elements.armas.value,
    sucursales : form.elements.sucursales.value,
    observaciones : form.elements.observaciones.value,
 
  };
}


function updateRow(row, formData) {
  const cells = row.querySelectorAll('td');
  const fields = Object.values(formData);
  for (let i = 0; i < fields.length; i++) {
    cells[i + 1].textContent = fields[i];
  }
  row.classList.remove('editingRow');
}

function handleSubmit(event) {
  event.preventDefault();
  const submitBtn = document.querySelector(".submitBtn");

  if (submitBtn.textContent === "Agregar") {
    const formData = getFormData(form);
    createNewRow(formData);
    showSnackbar("Registro creado exitosamente!");
  } else if (submitBtn.textContent === "Editar") {
    const row = document.querySelector('.editingRow');
    const formData = getFormData(form);
    updateRow(row, formData);
    submitBtn.textContent = "Agregar";
    showSnackbar("Registro editado exitosamente!");
  }

  resetForm();
  hideModal(modal);
  enableInputs(inputs);
}

function generatePieChart(data) {
  const countsBySucursal = data.reduce((counts, item) => {
    const sucursal = item.SUCURSALES;
    if (sucursal in counts) {
      counts[sucursal]++;
    } else {
      counts[sucursal] = 1;
    }
    return counts;
  }, {});

  const labels = Object.keys(countsBySucursal);
  const values = Object.values(countsBySucursal);

  const ctx = document.getElementById('chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          '#FFC107',
          '#FF9800',
          '#FF5722',
          '#E91E63',
          '#9C27B0',
          '#673AB7',
          '#3F51B5',
          '#03A9F4',
          '#4CAF50',
          '#00BCD4',
          '#8BC34A',
          '#FFEB3B',
          '#9E9E9E',
          '#607D8B',
        ],
      }],
    },
    
  });
}


















