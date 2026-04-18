const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-magistr-2',
  headers: {
    authorization: 'ced846d5-a40b-4ef6-99e7-24dd29b82c3c',
    'Content-Type': 'application/json'
  }
};

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(`Ошибка: ${res.status}`);
};

const request = (url, options) => fetch(url, options).then(checkResponse);

const getUserInfo = () => request(`${config.baseUrl}/users/me`, {
  headers: config.headers
});

const getInitialCards = () => request(`${config.baseUrl}/cards`, {
  headers: config.headers
});

const updateUserInfo = (name, about) => request(`${config.baseUrl}/users/me`, {
  method: 'PATCH',
  headers: config.headers,
  body: JSON.stringify({
    name,
    about
  })
});

const addNewCard = (name, link) => request(`${config.baseUrl}/cards`, {
  method: 'POST',
  headers: config.headers,
  body: JSON.stringify({
    name,
    link
  })
});

const deleteCardRequest = (cardId) => request(`${config.baseUrl}/cards/${cardId}`, {
  method: 'DELETE',
  headers: config.headers
});

const addLike = (cardId) => request(`${config.baseUrl}/cards/likes/${cardId}`, {
  method: 'PUT',
  headers: config.headers
});

const removeLike = (cardId) => request(`${config.baseUrl}/cards/likes/${cardId}`, {
  method: 'DELETE',
  headers: config.headers
});

const updateAvatar = (avatar) => request(`${config.baseUrl}/users/me/avatar`, {
  method: 'PATCH',
  headers: config.headers,
  body: JSON.stringify({
    avatar
  })
});

export { addLike, addNewCard, deleteCardRequest, getInitialCards, getUserInfo, removeLike, updateAvatar, updateUserInfo };
