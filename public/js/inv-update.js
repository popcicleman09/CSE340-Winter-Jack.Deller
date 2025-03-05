const form = document.querySelector("#editInventoryForm");
const updateBtn = form.querySelector('input[type="submit"]');

// Enable the button if any form field has changed
form.addEventListener("input", function () {
  updateBtn.disabled = ![...form.elements].some(input => input.value !== input.defaultValue);
});