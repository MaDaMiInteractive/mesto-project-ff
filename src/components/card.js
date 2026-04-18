const isLikedByUser = (likes, currentUserId) => likes.some((user) => user._id === currentUserId);

const deleteCard = (cardElement) => {
  cardElement.remove();
};

const updateLikesState = (likes, likeButton, likeCounter, currentUserId) => {
  likeCounter.textContent = likes.length;
  likeButton.classList.toggle('card__like-button_is-active', isLikedByUser(likes, currentUserId));
};

const createCard = (cardData, currentUserId, handleDeleteClick, handleLikeClick, handleImageClick, cardTemplate) => {
  const cardElement = cardTemplate.content.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');

  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  updateLikesState(cardData.likes, likeButton, likeCounter, currentUserId);

  cardImage.addEventListener('click', () => {
    handleImageClick(cardData);
  });

  likeButton.addEventListener('click', () => {
    handleLikeClick(cardData, likeButton, likeCounter);
  });

  if (cardData.owner._id === currentUserId) {
    deleteButton.addEventListener('click', () => {
      handleDeleteClick(cardData, cardElement);
    });
  } else {
    deleteButton.remove();
  }

  return cardElement;
};

export { createCard, deleteCard, updateLikesState };
