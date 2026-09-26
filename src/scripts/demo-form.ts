// Static replica: forms keep native validation but never send anything. The submit label says so
// briefly instead of faking the template's "Submitted" state.
const NOTICE = "Not sent · static demo";

document.querySelectorAll<HTMLFormElement>("form[data-demo-form]").forEach((form) => {
  const label = form.querySelector<HTMLElement>("[data-fx-label]");
  const input = form.querySelector<HTMLInputElement>('input[type="submit"]');
  const original = label?.textContent ?? input?.value ?? "";
  let timer = 0;
  const show = (text: string) => {
    if (label) label.textContent = text;
    else if (input) input.value = text;
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    show(NOTICE);
    clearTimeout(timer);
    timer = window.setTimeout(() => show(original), 3000);
  });
});
