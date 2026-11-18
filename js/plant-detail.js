document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("plant-detail");
  const slug = new URLSearchParams(location.search).get("slug");
  const plant = (window.PLANTS || []).find(p=>p.slug===slug);
  if (!plant) {
    root.innerHTML = `<div class="container"><a class="detail-back" href="catalog.html">← Вернуться в каталог</a><h1 class="plant-detail__title">Растение не найдено</h1><p>Возможно, ссылка устарела. Выберите растение в каталоге.</p><a class="button" href="catalog.html">Открыть каталог</a></div>`;
    return;
  }
  document.title = `${plant.name} — GreenRoom`;
  const metrics = [
    ["Освещение",plant.light,plant.lightText,"☼"],
    ["Полив",plant.water,plant.waterText,"◒"],
    ["Влажность",plant.humidity,plant.humidityText,"≈"],
    ["Температура",plant.temperature,plant.temperatureText,"℃"]
  ];
  const metricHtml = metrics.map(([name,value,text,icon])=>`<article class="metric">
    <div class="metric__head"><span class="metric__name">${icon} ${name}</span><span class="metric__value">${value}/5</span></div>
    <div class="segmented-bar" role="img" aria-label="${name}: ${value} из 5"><span class="segment ${value>=1?"filled":""}"></span><span class="segment ${value>=2?"filled":""}"></span><span class="segment ${value>=3?"filled":""}"></span><span class="segment ${value>=4?"filled":""}"></span><span class="segment ${value>=5?"filled":""}"></span></div>
    <small>${text}</small></article>`).join("");
  root.innerHTML = `<div class="container">
    <a class="detail-back" href="catalog.html">← Все растения</a>
    <section class="plant-detail__top">
      <div class="plant-detail__image"><img src="${plant.image}" alt="${plant.name}" loading="lazy" referrerpolicy="no-referrer"></div>
      <div><span class="plant-detail__group">${plant.group}</span><h1 class="plant-detail__title">${plant.name}</h1><p class="plant-detail__latin">${plant.latin}</p><p class="plant-detail__description">${plant.description}</p></div>
    </section>
    <section class="care-panel"><span class="eyebrow">ИНФОГРАФИКА УХОДА</span><h2>Что ему подходит</h2><p>Шкала показывает ориентировочную выраженность потребности, а подпись поясняет условия.</p>
      <div class="care-metrics">${metricHtml}</div>
      <div class="plant-note"><strong>Тип почвы:</strong> ${plant.soil}</div>
      <div class="plant-note"><strong>Полезно знать:</strong> ${plant.tip} Показатели ориентировочные: корректируйте уход по состоянию растения и условиям в помещении.</div>
    </section>
  </div>`;
});
