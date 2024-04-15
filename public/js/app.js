const closeBtn = document.querySelector('#closeBtn');
const closeItem = document.querySelector('.error');

closeBtn.addEventListener('click', () => {
      closeItem.classList = 'closed';
});