let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
let valueInput = "";
let input = null;
let indexEdit = -1;
let tempEdit = "";

window.onload = function init() {
  input = document.getElementById("add-tasks");
  input.addEventListener("change", updateValue);
  input.addEventListener("keyup", updateValue1);
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

//------Добавление Tasks
updateValue1 = (event) => {
  if (event.key === "Enter") {
    onClickButton();
  }
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

updateValue2 = (e) => {
  if (e.key === "Enter") {
    onClickSvgDone();
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    render();
  } else {
    tempEdit = e.target.value;
  }
};

onClickButton = () => {
  if (valueInput === "") return alert(" Введите текст");
  allTasks.push({
    text: valueInput,
    isCheck: false,
  });
  valueInput = ""; //обнуление input
  input.value = "";
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

onClickDelete = () => {
  allTasks = [];
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

updateValue = (event) => {
  valueInput = event.target.value;
};

onChangeCheckbox = (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

onClickSvgEdit = (index) => {
  indexEdit = index;
  render();
};

onClickSvgDone = () => {
  if (tempEdit === "") return alert(" Введите текст");
  allTasks[indexEdit].text = tempEdit;
  indexEdit = -1;
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

onClickSvgCancel = (index) => {
  indexEdit = -1;
  render();
};

onClickSvgDelete = (index) => {
  allTasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

textArea = (editInput) => {
  editInput.rows = Math.ceil(tempEdit.length / 16);
};

render = () => {
  const content = document.getElementById("content-page");

  allTasks.sort((task1, task2) =>
    task1.isCheck > task2.isCheck ? 1 : task1.isCheck < task2.isCheck ? -1 : 0
  );

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  } //удаляем старые элементы, чтобы не было повторений

  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";

    //-------Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "check";
    checkbox.checked = item.isCheck;
    checkbox.onchange = () => {
      onChangeCheckbox(index);
    };
    container.appendChild(checkbox);

    if (indexEdit === index) {
      const editInput = document.createElement("textarea");
      editInput.className = "edit-text";
      editInput.value = tempEdit;
      editInput.rows = Math.ceil(tempEdit.length / 16);
      editInput.onkeyup = (e) => updateValue2(e);
      editInput.oninput = () => textArea(editInput);

      //--------Done
      const svgDone = document.createElement("i");
      svgDone.className = "far fa-check-circle svg-icon";
      svgDone.onclick = () => {
        onClickSvgDone();
      };
      container.appendChild(editInput);
      container.appendChild(svgDone);

      //--------Cancel
      const svgCancel = document.createElement("i");
      svgCancel.className = "far fa-window-close svg-icon";
      svgCancel.onclick = () => {
        onClickSvgCancel(index);
      };
      container.appendChild(svgCancel);
      checkbox.disabled = true; //свойство инпута(отключить галочку)
    } else {
      const text = document.createElement("p");
      text.innerText = item.text;
      text.className = item.isCheck ? "text-task done-text" : "text-task";
      container.appendChild(text);

      //--------Edit
      const svgEdit = document.createElement("i");
      svgEdit.className = "far fa-edit svg-icon";
      svgEdit.onclick = () => {
        tempEdit = item.text;
        onClickSvgEdit(index);
      };
      container.appendChild(svgEdit);
      svgEdit.style.display = item.isCheck ? "none" : "flex";

      //-------Delete
      const svgDelete = document.createElement("i");
      svgDelete.className = "far fa-trash-alt svg-icon";
      svgDelete.onclick = () => {
        onClickSvgDelete(index);
      };
      container.appendChild(svgDelete);
    }

    content.appendChild(container);
  });

};
