const closeBtn = document.querySelector('#closeBtn');
const closeItem = document.querySelector('.errContainer');
const all = document.querySelector('*');

closeBtn.addEventListener('click', () => {
      closeItem.classList = 'closed';
});

// all.addEventListener('click', () => {
//       closeItem.classList = 'closed';
// });
