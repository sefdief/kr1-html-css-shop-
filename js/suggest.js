document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("suggest-form");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = `Предложение для справочника GreenRoom: ${data.get("plant")}`;
    const body = [
      `Растение: ${data.get("plant")}`,
      `Группа: ${data.get("group") || "не указана"}`,
      `Описание предложения: ${data.get("details") || "не указано"}`,
      `E-mail для ответа: ${data.get("email") || "не указан"}`
    ].join("\n");
    const mailto = `mailto:greenroom@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById("form-status").textContent = "Открываем почтовое приложение. Замените greenroom@example.com на ваш рабочий адрес перед публикацией.";
    window.location.href = mailto;
  });
});
