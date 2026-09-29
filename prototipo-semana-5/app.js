'use strict';

const NEWS_DATA_URL = 'data/noticias.json';
const FAVORITES_STORAGE_KEY = 'vdl-noticias-favoritos';
const CATEGORIES = ['Educación', 'Tecnología', 'Turismo', 'Comercio'];
let loadedNews = [];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function readFavoriteIds() {
  try {
    const savedIds = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
    return Array.isArray(savedIds) ? savedIds.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function detailUrl(news) {
  return `detalle.html?id=${encodeURIComponent(news.id)}`;
}

function createFavoriteButton(news) {
  const isSaved = readFavoriteIds().includes(news.id);
  const label = isSaved ? 'Quitar de favoritos' : 'Guardar en favoritos';
  return `<button class="favorite-button${isSaved ? ' is-saved' : ''}" type="button" data-favorite-id="${escapeHtml(news.id)}" aria-pressed="${isSaved}">${label}</button>`;
}

function createNewsCard(news, className = 'news-card') {
  const safeUrl = escapeHtml(detailUrl(news));
  return `
    <article class="${className}">
      <a class="card-image" href="${safeUrl}">
        <img src="${escapeHtml(news.imagen)}" alt="${escapeHtml(news.textoAlternativo)}">
      </a>
      <div class="card-content">
        <p class="category">${escapeHtml(news.categoria)}</p>
        <h3><a href="${safeUrl}">${escapeHtml(news.titulo)}</a></h3>
        <p>${escapeHtml(news.resumen)}</p>
        <div class="card-actions"><a class="text-link" href="${safeUrl}">Leer más <span aria-hidden="true">→</span></a>${createFavoriteButton(news)}</div>
      </div>
    </article>`;
}

function renderHome(newsItems) {
  const featuredNews = newsItems.find((news) => news.destacada) || newsItems[0];
  const featuredSection = document.querySelector('#featured-story');
  const homeGrid = document.querySelector('#home-news');
  if (!featuredNews || !featuredSection || !homeGrid) return;

  document.querySelector('#featured-category').textContent = `Historia destacada · ${featuredNews.categoria}`;
  document.querySelector('#featured-title').textContent = featuredNews.titulo;
  document.querySelector('#featured-summary').textContent = featuredNews.resumen;
  const image = document.querySelector('#featured-image');
  image.src = featuredNews.imagen;
  image.alt = featuredNews.textoAlternativo;
  document.querySelector('#featured-link').href = detailUrl(featuredNews);

  const remainingNews = newsItems.filter((news) => news.id !== featuredNews.id);
  homeGrid.innerHTML = remainingNews.map((news) => createNewsCard(news)).join('');
}

function renderNewsList(newsItems) {
  const list = document.querySelector('#news-list');
  if (!list) return;

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get('categoria') || '';
  const selectedCategory = CATEGORIES.includes(requestedCategory) ? requestedCategory : '';
  const visibleNews = selectedCategory
    ? newsItems.filter((news) => news.categoria === selectedCategory)
    : newsItems;

  document.querySelectorAll('[data-category]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.category === selectedCategory));
  });
  document.querySelector('#news-count').textContent = selectedCategory
    ? `${visibleNews.length} ${visibleNews.length === 1 ? 'noticia' : 'noticias'} de ${selectedCategory}`
    : `${visibleNews.length} noticias de muestra`;

  list.classList.toggle('is-empty', visibleNews.length === 0);
  list.innerHTML = visibleNews.length
    ? visibleNews.map((news) => createNewsCard(news, 'news-card listing-card')).join('')
    : '<p class="empty-list-message">No hay noticias en esta categoría por ahora.</p>';
}

function renderFavorites(newsItems) {
  const list = document.querySelector('#favorite-list');
  if (!list) return;

  const favoritesLoading = document.querySelector('#favorites-loading');
  if (favoritesLoading) favoritesLoading.hidden = true;
  const favoriteIds = new Set(readFavoriteIds());
  const favoriteNews = newsItems.filter((news) => favoriteIds.has(news.id));
  const emptyState = document.querySelector('#favorites-empty');
  const count = document.querySelector('#favorite-count');

  count.textContent = `${favoriteNews.length} ${favoriteNews.length === 1 ? 'noticia guardada' : 'noticias guardadas'}`;
  emptyState.hidden = favoriteNews.length > 0;
  list.hidden = favoriteNews.length === 0;
  list.innerHTML = favoriteNews.map((news) => createNewsCard(news, 'news-card favorite-card')).join('');
}

function renderDetail(newsItems) {
  const root = document.querySelector('#detail-root');
  if (!root) return;

  const id = new URLSearchParams(window.location.search).get('id');
  const news = newsItems.find((item) => item.id === id);
  if (!news) {
    root.innerHTML = '<div class="empty-panel"><h1>No encontramos esa noticia</h1><p>El enlace puede estar desactualizado. Explora el listado para ver las historias disponibles.</p><a class="button" href="noticias.html">Ver noticias</a></div>';
    document.title = 'Noticia no encontrada | VDL Noticias';
    return;
  }

  const paragraphs = String(news.contenido || '').split(/\n\s*\n/).filter(Boolean);
  root.innerHTML = `
    <p class="breadcrumb"><a href="noticias.html">Noticias</a> <span aria-hidden="true">/</span> ${escapeHtml(news.categoria)}</p>
    <div class="article-layout">
      <article class="article-content">
        <p class="category">${escapeHtml(news.categoria)}</p>
        <h1>${escapeHtml(news.titulo)}</h1>
        <p class="article-summary">${escapeHtml(news.resumen)}</p>
        <img class="article-image" src="${escapeHtml(news.imagen)}" alt="${escapeHtml(news.textoAlternativo)}">
        <div class="article-body">${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div>
      </article>
      <aside class="article-sidebar"><h2>Continúa explorando</h2><p>Descubre más historias de educación, tecnología, turismo y comercio.</p>${createFavoriteButton(news)}<a class="button" href="noticias.html">Ver todas las noticias</a><a class="text-link" href="contacto.html">Comparte una idea</a></aside>
    </div>`;
  document.title = `${news.titulo} | VDL Noticias`;
}

function updateFavoriteButtons() {
  const favoriteIds = new Set(readFavoriteIds());
  document.querySelectorAll('[data-favorite-id]').forEach((button) => {
    const isSaved = favoriteIds.has(button.dataset.favoriteId);
    button.setAttribute('aria-pressed', String(isSaved));
    button.classList.toggle('is-saved', isSaved);
    button.textContent = isSaved ? 'Quitar de favoritos' : 'Guardar en favoritos';
  });
}

function announceFavoriteChange(message) {
  let status = document.querySelector('#favorite-live-status');
  if (!status) {
    status = document.createElement('p');
    status.id = 'favorite-live-status';
    status.className = 'visually-hidden';
    status.setAttribute('aria-live', 'polite');
    document.body.append(status);
  }
  status.textContent = message;
}

function toggleFavorite(id) {
  const favoriteIds = readFavoriteIds();
  const isSaved = favoriteIds.includes(id);
  const nextIds = isSaved ? favoriteIds.filter((savedId) => savedId !== id) : [...favoriteIds, id];

  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextIds));
  } catch {
    announceFavoriteChange('No se pudo guardar el cambio en este navegador.');
    return;
  }

  updateFavoriteButtons();
  renderFavorites(loadedNews);
  announceFavoriteChange(isSaved ? 'Noticia retirada de favoritos.' : 'Noticia guardada en favoritos.');
}

function showLoadError(error) {
  console.error('No fue posible cargar el catálogo de noticias.', error);
  const message = 'No fue posible cargar las noticias. Abre el prototipo desde un servidor local y vuelve a intentar.';
  const homeError = document.querySelector('#home-error');
  const newsError = document.querySelector('#news-error');
  const detailRoot = document.querySelector('#detail-root');
  const favoritesError = document.querySelector('#favorites-error');
  if (homeError) { homeError.textContent = message; homeError.hidden = false; }
  if (newsError) { newsError.textContent = message; newsError.hidden = false; }
  if (detailRoot) detailRoot.innerHTML = `<p class="status-message error-message" role="alert">${message}</p>`;
  if (favoritesError) { favoritesError.textContent = message; favoritesError.hidden = false; }
  const favoritesLoading = document.querySelector('#favorites-loading');
  if (favoritesLoading) favoritesLoading.hidden = true;
  const homeGrid = document.querySelector('#home-news');
  if (homeGrid) homeGrid.innerHTML = '';
  const newsList = document.querySelector('#news-list');
  if (newsList) newsList.innerHTML = '';
  const count = document.querySelector('#news-count');
  if (count) count.textContent = 'Catálogo no disponible';
  const favoritesCount = document.querySelector('#favorite-count');
  if (favoritesCount) favoritesCount.textContent = 'Favoritos no disponibles';
}

async function startNewsPages() {
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-favorite-id]') : null;
    if (target) toggleFavorite(target.dataset.favoriteId);
  });

  try {
    const response = await fetch(NEWS_DATA_URL);
    if (!response.ok) throw new Error(`Respuesta HTTP ${response.status}`);
    const newsItems = await response.json();
    if (!Array.isArray(newsItems)) throw new Error('El archivo JSON debe contener una lista de noticias.');
    loadedNews = newsItems;

    renderHome(newsItems);
    renderNewsList(newsItems);
    renderDetail(newsItems);
    renderFavorites(newsItems);

    document.querySelectorAll('[data-category]').forEach((button) => {
      button.addEventListener('click', () => {
        const url = new URL(window.location.href);
        if (button.dataset.category) url.searchParams.set('categoria', button.dataset.category);
        else url.searchParams.delete('categoria');
        window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
        renderNewsList(newsItems);
      });
    });
  } catch (error) {
    showLoadError(error);
  }
}

startNewsPages();
