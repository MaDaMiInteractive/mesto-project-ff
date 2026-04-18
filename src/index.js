import './pages/index.css';

import { addLike, addNewCard, deleteCardRequest, getInitialCards, getUserInfo, removeLike, updateAvatar, updateUserInfo } from './components/api.js';
import { createCard, deleteCard, updateLikesState } from './components/card.js';
import { closeModal, openModal, setModalEventListeners } from './components/modal.js';
import { clearValidation, enableValidation } from './components/validation.js';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const placesList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template');
const popups = document.querySelectorAll('.popup');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImageButton = document.querySelector('.profile__image');
const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');

const profilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const avatarPopup = document.querySelector('.popup_type_update-avatar');
const imagePopup = document.querySelector('.popup_type_image');
const deletePopup = document.querySelector('.popup_type_delete-card');

const profileForm = profilePopup.querySelector('.popup__form');
const profileNameInput = profileForm.querySelector('.popup__input_type_name');
const profileDescriptionInput = profileForm.querySelector('.popup__input_type_description');
const profileSubmitButton = profileForm.querySelector('.popup__button');

const addCardForm = addCardPopup.querySelector('.popup__form');
const placeNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const placeLinkInput = addCardForm.querySelector('.popup__input_type_url');
const addCardSubmitButton = addCardForm.querySelector('.popup__button');

const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarLinkInput = avatarForm.querySelector('.popup__input_type_avatar-url');
const avatarSubmitButton = avatarForm.querySelector('.popup__button');

const deleteCardForm = deletePopup.querySelector('.popup__form');
const deleteCardSubmitButton = deleteCardForm.querySelector('.popup__button');

const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

let currentUserId = '';
let cardToDelete = null;
let cardElementToDelete = null;

const renderLoading = (buttonElement, isLoading, buttonText = 'Сохранить', loadingText = 'Сохранение...') => {
  buttonElement.textContent = isLoading ? loadingText : buttonText;
};

const setUserInfo = ({ name, about, avatar }) => {
  profileTitle.textContent = name;
  profileDescription.textContent = about;
  profileImageButton.style.backgroundImage = `url(${avatar})`;
};

const handleImageClick = ({ name, link }) => {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModal(imagePopup);
};

const handleDeleteButtonClick = (cardData, cardElement) => {
  cardToDelete = cardData;
  cardElementToDelete = cardElement;
  openModal(deletePopup);
};

const handleLikeButtonClick = (cardData, likeButton, likeCounter) => {
  const isLiked = cardData.likes.some((user) => user._id === currentUserId);
  const likeRequest = isLiked ? removeLike(cardData._id) : addLike(cardData._id);

  likeRequest
    .then((updatedCard) => {
      cardData.likes = updatedCard.likes;
      updateLikesState(cardData.likes, likeButton, likeCounter, currentUserId);
    })
    .catch((err) => {
      console.error(err);
    });
};

const renderCard = (cardData, shouldPrepend = false) => {
  const cardElement = createCard(
    cardData,
    currentUserId,
    handleDeleteButtonClick,
    handleLikeButtonClick,
    handleImageClick,
    cardTemplate
  );

  if (shouldPrepend) {
    placesList.prepend(cardElement);
    return;
  }

  placesList.append(cardElement);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  renderLoading(profileSubmitButton, true);

  updateUserInfo(profileNameInput.value, profileDescriptionInput.value)
    .then((userData) => {
      setUserInfo(userData);
      closeModal(profilePopup);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(profileSubmitButton, false);
    });
};

const handleAddCardFormSubmit = (evt) => {
  evt.preventDefault();
  renderLoading(addCardSubmitButton, true);

  addNewCard(placeNameInput.value, placeLinkInput.value)
    .then((cardData) => {
      renderCard(cardData, true);
      addCardForm.reset();
      clearValidation(addCardForm, validationConfig);
      closeModal(addCardPopup);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(addCardSubmitButton, false);
    });
};

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  renderLoading(avatarSubmitButton, true);

  updateAvatar(avatarLinkInput.value)
    .then((userData) => {
      setUserInfo(userData);
      avatarForm.reset();
      clearValidation(avatarForm, validationConfig);
      closeModal(avatarPopup);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(avatarSubmitButton, false);
    });
};

const handleDeleteCardSubmit = (evt) => {
  evt.preventDefault();

  if (!cardToDelete || !cardElementToDelete) {
    return;
  }

  renderLoading(deleteCardSubmitButton, true, 'Да', 'Удаление...');

  deleteCardRequest(cardToDelete._id)
    .then(() => {
      deleteCard(cardElementToDelete);
      closeModal(deletePopup);
      cardToDelete = null;
      cardElementToDelete = null;
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      renderLoading(deleteCardSubmitButton, false, 'Да');
    });
};

profileEditButton.addEventListener('click', () => {
  profileNameInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(profilePopup);
});

addCardButton.addEventListener('click', () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openModal(addCardPopup);
});

profileImageButton.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

profileForm.addEventListener('submit', handleProfileFormSubmit);
addCardForm.addEventListener('submit', handleAddCardFormSubmit);
avatarForm.addEventListener('submit', handleAvatarFormSubmit);
deleteCardForm.addEventListener('submit', handleDeleteCardSubmit);

popups.forEach((popup) => {
  setModalEventListeners(popup);
});

enableValidation(validationConfig);

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    setUserInfo(userData);

    cards.forEach((cardData) => {
      renderCard(cardData);
    });
  })
  .catch((err) => {
    console.error(err);
  });
