function renderCard(piece){
  return '' +
    '<button type="button" class="art-card" data-id="' + piece.id + '">' +
      '<div class="frame-img"><img src="' + piece.img + '" alt="' + piece.title + '" loading="lazy"></div>' +
      '<div class="art-cap">' +
        '<span class="art-title">' + piece.title + '</span>' +
        '<span class="art-meta">' + piece.category + '<br>' + piece.date + '</span>' +
      '</div>' +
    '</button>';
}

document.getElementById('grid-all-artwork').innerHTML = ART.map(renderCard).join('');
document.getElementById('grid-mixed-media').innerHTML = ART.filter(function(p){ return p.category === 'mixed media'; }).map(renderCard).join('');
document.getElementById('grid-traditional-media').innerHTML = ART.filter(function(p){ return p.category !== 'mixed media'; }).map(renderCard).join('');

var lb = document.getElementById('lightbox');
var lbImage = document.getElementById('lb-image');
var lbCategory = document.getElementById('lb-category');
var lbTitle = document.getElementById('lb-title');
var lbMeta = document.getElementById('lb-meta');

function openLightbox(id){
  var piece = ART.filter(function(p){ return p.id === id; })[0];
  if (!piece) return;
  lbImage.src = piece.img;
  lbImage.alt = piece.title;
  lbCategory.textContent = piece.category;
  lbTitle.textContent = piece.title;
  lbMeta.textContent = [piece.medium, piece.dimensions, piece.date].filter(function(v){ return v; }).join(' · ');
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lb-open');
}

function closeLightbox(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lb-open');
}

document.body.addEventListener('click', function(e){
  var card = e.target.closest('.art-card');
  if (card){ openLightbox(Number(card.dataset.id)); return; }
  if (e.target === lb){ closeLightbox(); }
});
document.getElementById('lb-back-btn').addEventListener('click', closeLightbox);
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
});

document.addEventListener('keydown', function(e){
  if (e.key === 'y' || e.key === 'Y'){
    var text = document.querySelector('.wordmark-text');
    var sig = document.querySelector('.wordmark-sig');
    text.hidden = !text.hidden;
    sig.hidden = !sig.hidden;
  }
});

var ROUTES = ['about','resume','projects','all-artwork','mixed-media','traditional-media','contact'];

function showRoute(hash){
  var route = ROUTES.indexOf(hash) === -1 ? 'home' : hash;
  var allViews = ROUTES.concat(['home']);
  allViews.forEach(function(r){
    document.getElementById('view-' + r).classList.toggle('active', r === route);
  });
  document.querySelectorAll('#primary-nav a[data-route]').forEach(function(a){
    if (a.dataset.route === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

window.addEventListener('hashchange', function(){
  showRoute(location.hash.replace('#',''));
});

showRoute(location.hash.replace('#',''));
