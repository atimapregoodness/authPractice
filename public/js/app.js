const closeBtn = document.querySelector('#closeBtn');
const closeItem = document.querySelector('.errContainer');
const all = document.querySelector('*');
const plswaitBtn = document.querySelector('#plswait');

plswaitBtn.addEventListener('click', () => {
      plswaitBtn.innerText = 'please wait...';
});

closeBtn.addEventListener('click', () => {
      closeItem.classList = 'closed';
});



// all.addEventListener('click', () => {
//       closeItem.classList = 'closed';
// });
