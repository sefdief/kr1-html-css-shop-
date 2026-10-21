document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. ФИКСИРОВАННАЯ КНОПКА «НАВЕРХ»
     ========================================================================== */
  const toTopButton = document.querySelector('.to-top');

  if (toTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        toTopButton.classList.add('to-top--visible');
      } else {
        toTopButton.classList.remove('to-top--visible');
      }
    });

    toTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     2. УЛУЧШЕННОЕ МОДАЛЬНОЕ ОКНО (<dialog>)
     ========================================================================== */
  const dialog = document.getElementById('order-dialog');
  const orderButtons = document.querySelectorAll('[data-product]');
  const closeDialogButton = document.querySelector('[data-close-dialog]');
  const productInput = document.getElementById('dlg-product');

  if (dialog) {
    orderButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productName = button.getAttribute('data-product');
        if (productInput && productName) {
          productInput.value = productName;
        }
        dialog.showModal();
      });
    });

    if (closeDialogButton) {
      closeDialogButton.addEventListener('click', () => {
        dialog.close();
      });
    }

    // Закрытие кликом по размытому фону (backdrop)
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        dialog.close();
      }
    });
  }

  /* ==========================================================================
     3. РАБОЧАЯ ДИНАМИЧЕСКАЯ ФИЛЬТРАЦИЯ КАТАЛОГА И СЛАЙДЕР ЦЕНЫ
     ========================================================================== */
  const categoryCheckboxes = document.querySelectorAll('.filters__list input[type="checkbox"]');
  const productCards = document.querySelectorAll('.catalog__grid .product-card');
  const priceSlider = document.getElementById('price-slider');
  const priceValue = document.getElementById('price-value');

  function filterProducts() {
    // Получаем список активных категорий
    const activeCategories = Array.from(categoryCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value.toLowerCase());

    // Получаем значение слайдера цены
    const maxPrice = priceSlider ? parseInt(priceSlider.value, 10) : 50000;

    // Обновляем отображаемый максимум цены на экране
    if (priceValue) {
      priceValue.textContent = Number(maxPrice).toLocaleString('ru-RU');
    }

    // Фильтруем каждая карточку по категории и по максимальной цене
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category')?.toLowerCase() || '';
      const cardPrice = parseInt(card.getAttribute('data-price') || '0', 10);
      
      const matchesCategory = activeCategories.length === 0 || activeCategories.includes(cardCategory);
      const matchesPrice = cardPrice <= maxPrice;

      if (matchesCategory && matchesPrice) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (productCards.length > 0) {
    // Подписываемся на изменение чекбоксов категорий
    categoryCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', filterProducts);
    });

    // Мгновенная фильтрация при движении ползунка цены (без кнопки "Применить")
    if (priceSlider) {
      priceSlider.addEventListener('input', filterProducts);
    }

    // Запускаем первичное отображение при загрузке страницы
    filterProducts();
  }

  /* ==========================================================================
     4. ИНТЕРАКТИВНОЕ ДОБАВЛЕНИЕ ОТЗЫВОВ
     ========================================================================== */
  const reviewForm = document.getElementById('review-form');
  const reviewsGrid = document.querySelector('.reviews__grid');

  if (reviewForm && reviewsGrid) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const authorInput = document.getElementById('review-author');
      const ratingSelect = document.getElementById('review-rating');
      const textInput = document.getElementById('review-text');

      if (!authorInput.value || !ratingSelect.value || !textInput.value) {
        alert('Пожалуйста, заполните все поля отзыва.');
        return;
      }

      const author = authorInput.value.trim();
      const rating = parseInt(ratingSelect.value, 10);
      const text = textInput.value.trim();
      
      const initials = author.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
      
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const currentDate = new Date().toLocaleDateString('ru-RU', options);

      const newReviewCard = document.createElement('article');
      newReviewCard.className = 'review-card';
      newReviewCard.innerHTML = `
        <div class="review-card__header">
          <div class="review-card__avatar">${initials}</div>
          <div>
            <p class="review-card__author">${author}</p>
            <p class="review-card__date">${currentDate}</p>
          </div>
        </div>
        <div class="review-card__rating">${stars}</div>
        <p class="review-card__text">${text}</p>
      `;

      reviewsGrid.prepend(newReviewCard);
      reviewForm.reset();
      
      const successMsg = document.querySelector('[data-success]');
      if (successMsg) {
        successMsg.hidden = false;
        setTimeout(() => { successMsg.hidden = true; }, 3000);
      }
    });
  }

  /* ==========================================================================
     5. ОБЩАЯ ВАЛИДАЦИЯ ФОРМ
     ========================================================================== */
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    if (form.id === 'review-form') return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

      inputs.forEach(input => {
        if (!input.checkValidity()) {
          isValid = false;
          input.setAttribute('aria-invalid', 'true');
        } else {
          input.removeAttribute('aria-invalid');
        }
      });

      if (isValid) {
        if (dialog && dialog.open) {
          dialog.close();
        }
        const successMessage = document.querySelector('[data-success]');
        if (successMessage) {
          successMessage.hidden = false;
          setTimeout(() => { successMessage.hidden = true; }, 4000);
        }
        form.reset();
      }
    });
  });
});