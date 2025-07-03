let toDoInput = {
    task: ""
};
let toDoList = [];

const form = document.querySelector(".form");

const tasks = document.querySelector(".task-lists");

const itemsFast = document.querySelector(".items-fast-list");
const itemsSlow = document.querySelector(".items-slow-list")

const list = document.querySelector(".list");
const item = document.querySelector(".item");
const items = document.querySelectorAll(".item");
const reset = document.querySelector(".reset");
const counter = document.querySelector(".counter");

new Sortable(itemsFast, {
  group: 'shared', // set both lists to same group
  animation: 450
});

new Sortable(itemsSlow, {
  group: 'shared',
  animation: 450
});



const localStoreKey = "My-to-do-input";
const localStoreKeys = "My-to-do-list";

const savedDataInput = localStorage.getItem(localStoreKey);
if (savedDataInput) {
    toDoInput = JSON.parse(savedDataInput);
    form.input.value = toDoInput.task || "";
};

const savedDataList = localStorage.getItem(localStoreKeys);
if (savedDataList) {
    toDoList = JSON.parse(savedDataList);
    toDoList.forEach(taskObj => {
        createToDoItem(taskObj.task)
    });
  updateNumbers();
};

form.addEventListener("input", handleInput)
form.addEventListener("submit", handleSubmit);
tasks.addEventListener("click", handleDelete);
list.addEventListener("change", handleCheckBox);

function handleInput(ev) {
    toDoInput.task = ev.target.value.trim();
    localStorage.setItem(localStoreKey, JSON.stringify(toDoInput));
}

function handleSubmit(event) {
    event.preventDefault();

    const inputValue = event.target.input.value.trim();
    if (inputValue === "") {
        return Swal.fire({
            title: "Введіть свій task",
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
          });
    };

    const allTexts = list.querySelectorAll(".text");
    const isDuplicate = Array.from(allTexts).some(el => {
        const text = el.textContent.replace(/^\d+\.\s*/, '').trim().toLowerCase();
        return text === inputValue.toLowerCase();
    });

    if (isDuplicate) {
        return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Цей task вже існує",
          });
    };

    createToDoItem(inputValue);
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Твій task збережено, бро!",
        showConfirmButton: false,
        timer: 1500
    });

    toDoList.push({task: inputValue});
    localStorage.setItem(localStoreKeys, JSON.stringify(toDoList));

    form.reset();
    localStorage.removeItem(localStoreKey);
    toDoInput = {
        task: ""
    };
    
    updateNumbers();
};

function createToDoItem(taskToDo) {
    const markup = `
        <li class="item">
            <label class="label">
                <span class="text">${taskToDo}</span>
                <input type="checkbox" class="check visually-hidden">
                <span class="accept-icon">
                    <svg class="icon-checkbox" width="16" height="14">
                        <use href="./icons.svg#icon-checkbox"></use>
                    </svg>
                </span>
            </label>
            <button type="button" class="btn reset">Делете</button>
        </li>`;
    list.insertAdjacentHTML("beforeend", markup);
}

function handleDelete(event) {
    if (event.target.classList.contains("reset")) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
          });
          swalWithBootstrapButtons.fire({
            title: "Ти впевнений?",
            text: "Цей task буде видалено зі списку!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Так, видалити!",
            cancelButtonText: "Ні, залишити!",
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              swalWithBootstrapButtons.fire({
                title: "Видалено!",
                text: "Твій task було видалено.",
                icon: "success"
              });
              const item = event.target.closest(".item");
              const taskText = item.querySelector(".text").textContent.replace(/^\d+\.\s*/, '').trim();
      
              item.remove();
      
              toDoList = toDoList.filter(task => task.task !== taskText);
              localStorage.setItem(localStoreKeys, JSON.stringify(toDoList));
              updateNumbers();
            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire({
                title: "Відміна",
                text: "Твій task в безпеці :)",
                icon: "error"
              });
            }
          });
    };
};

function updateNumbers() {
    const items = tasks.querySelectorAll(".item");
    items.forEach((item, index) => {
        const text = item.querySelector(".text");
        text.textContent = `${index + 1}. ${text.textContent.replace(/^\d+\.\s*/, '')}`;
    });
    const totalItems = tasks.querySelectorAll(".item").length;
    counter.textContent = `Залишилось до виконання ${totalItems} завдань`;
};

function handleCheckBox(event) {
    if (event.target.classList.contains("check")) {
        const item = event.target.closest(".item");
        item.classList.toggle("done", event.target.checked);
    };
};