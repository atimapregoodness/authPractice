const closeBtn = document.querySelector('#closeBtn');
const closeItem = document.querySelector('.errContainer');

closeBtn.addEventListener('click', () => {
      closeItem.classList = 'closed';
});