const ELEMENT = (tag, id, className, value) =>
  `<${tag} id="${id}" class="${className}">${value}</${tag}>`;

const INPUTS_ID = {
  name: "name",
  lastName: "lastName",
  phone: "phone",
};

const ERROR_MSGS = {
  nameEmpty: "Name cannot be empty",
  nameLength: "Name should be more then 3 symbols",
  lastNameEmpty: "Last name cannot be empty",
  lastNameLength: "Last name should be more then 3 symbols",
  phoneEmpty: "Phone cannot be empty",
  phoneDigitsAmount: "Phone number must be at least 12 digits length",
};

const VALIDATION_FUNC = {
  [INPUTS_ID.name]: validateName,
  [INPUTS_ID.lastName]: validateLastName,
  [INPUTS_ID.phone]: validatePhone,
};

const VALIDATIONS_IDS = {
  name: "name-validation",
  lastName: "lastName-validation",
  phone: "phone-validation",
};
const PHONE_REGEXP = /^((\+?3)?8)?0\d{9}$/;
const buttonEl = document.querySelector("#btn");
const userInputsEl = document.querySelectorAll(".user-inputs");
const containerEl = document.querySelector(".table-container");
const validationContainers = document.querySelectorAll(".validation-msgs");
let contacts = [];
let errors = [];
let isAllDataValid = false;

buttonEl.addEventListener("click", onContactCreate);
containerEl.addEventListener("click", onClick);
// 1. Валидировать данные
// 2. Создать контакт
// 3. создать эелемент
// 4. отрисовать элемент
// 5. очистить данные

function onContactCreate() {
  validateAllInputs(userInputsEl);
  crateElement(userInputsEl);
  renderElement(contacts[contacts.length - 1], containerEl);
  //   clearForm(userInputsEl);
}

function onClick(e) {
  onDeleteItem(e);
  buttonEl.removeEventListener("click", onContactCreate);
}

function validateAllInputs(elementsArray) {
  errors = [];
  isAllDataValid = ![...elementsArray].filter(
    (element) => !VALIDATION_FUNC[element.id](element)
  ).length;
  renderValidationErrors();
}

function validateName(element) {
  let result = true;

  if (!element.value.trim()) {
    const error = { id: element.id, error: ERROR_MSGS.nameEmpty };
    errors.push(error);
    result = false;
  }
  if (element.value.length <= 3) {
    const error = { id: element.id, error: ERROR_MSGS.nameLength };
    errors.push(error);
    result = false;
  }
  return result;
}

function validateLastName(element) {
  let result = true;
  if (!element.value.trim()) {
    const error = { id: element.id, error: ERROR_MSGS.lastNameEmpty };
    errors.push(error);
    result = false;
  }
  if (element.value.length <= 3) {
    const error = { id: element.id, error: ERROR_MSGS.lastNameLength };
    errors.push(error);
    result = false;
  }
  return result;
}

function validatePhone(element) {
  let result = true;
  const phone = element.value.replace(/[\s\-\(\)]/g, "");
  if (!phone.trim()) {
    const error = { id: element.id, error: ERROR_MSGS.phoneEmpty };
    errors.push(error);
    result = false;
  }

  if (!phone.match(PHONE_REGEXP)) {
    const error = { id: element.id, error: ERROR_MSGS.phoneDigitsAmount };
    errors.push(error);
    result = false;
  }
  return result;
}

function crateElement(elementsArray) {
  removeValidationMessages();
  const contact = [...elementsArray].reduce(
    (acc, el) => {
      acc[INPUTS_ID[el.id]] = el.value;
      return acc;
    },
    { id: `list-item_${Math.random()}` }
  );
  console.log("contact", contact);
  contacts.push(contact);
}

function renderElement(element, table) {
  console.log(element);
  const container = createListItemContainer(
    "div",
    element.id,
    "table-items-wrapper"
  );
  Object.keys(element).forEach((key) => {
    if (key !== "id") {
      const elem = ELEMENT(
        "div",
        key + element[key] + 2,
        "table-item",
        element[key]
      );
      container.insertAdjacentHTML("beforeend", elem);
      // container.innerHTML += elem;
    }
  });
  container.insertAdjacentHTML(
    "beforeend",
    `<div><button class="table-item" id="delete">Delete</button></div>`
  );
  table.append(container);
}

function createListItemContainer(tag, id, className) {
  const container = document.createElement(tag);
  container.id = id;
  container.classList.add(className);
  return container;
}

function clearForm(dataElementsArray) {
  dataElementsArray.forEach((e) => (e.value = ""));
}

function renderValidationErrors() {
  if (errors.length) {
    removeValidationMessages();
    errors.forEach((e) => {
      const errorContainer = [...validationContainers].find(
        (v) => v.id === VALIDATIONS_IDS[e.id]
      );
      errorContainer.innerHTML += ELEMENT("div", e.error, "", e.error);
    });
  }
}

function removeValidationMessages() {
  validationContainers.forEach((c) => (c.innerHTML = ""));
}

function onDeleteItem(e) {
    console.log(e.target)
  if (e.target.id === "delete") {
    const item = e.target.closest(".table-items-wrapper");
    contacts = contacts.filter((e) => e.id !== item.id);
    console.log(contacts);
    item.remove();
  }
}
