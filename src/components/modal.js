const handleEscClose = (evt) => {
  if (evt.key !== 'Escape') {
    return;
  }

  const openedPopup = document.querySelector('.popup_is-opened');

  if (openedPopup) {
    closeModal(openedPopup);
  }
};

const openModal = (popup) => {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
};

const closeModal = (popup) => {
  popup.classList.remove('popup_is-opened');

  if (!document.querySelector('.popup_is-opened')) {
    document.removeEventListener('keydown', handleEscClose);
  }
};

const handleOverlayClose = (evt) => {
  if (evt.currentTarget === evt.target) {
    closeModal(evt.currentTarget);
  }
};

const setModalEventListeners = (popup) => {
  const closeButton = popup.querySelector('.popup__close');

  closeButton.addEventListener('click', () => {
    closeModal(popup);
  });

  popup.addEventListener('click', handleOverlayClose);
};

export { closeModal, openModal, setModalEventListeners };
