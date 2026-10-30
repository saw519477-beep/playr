const form = document.getElementById('player-form');
const mediaType = document.getElementById('media-type');
const tmdbId = document.getElementById('tmdb-id');
const episodeFields = document.getElementById('episode-fields');
const season = document.getElementById('season');
const episode = document.getElementById('episode');
const routePreview = document.getElementById('route-preview');
const playerFrame = document.getElementById('player-frame');
const playerPlaceholder = document.getElementById('player-placeholder');
const formStatus = document.getElementById('form-status');

document.getElementById('base-url').textContent = window.location.origin;

function getPlayerPath() {
  const id = tmdbId.value.trim();
  if (!id) return mediaType.value === 'tv' ? '/tv/{tmdbId}/S{season}/E{episode}' : '/movie/{tmdbId}';
  if (mediaType.value === 'tv') return `/tv/${id}/S${season.value || 1}/E${episode.value || 1}`;
  return `/movie/${id}`;
}

function updateFormState() {
  const isTv = mediaType.value === 'tv';
  episodeFields.hidden = !isTv;
  season.required = isTv;
  episode.required = isTv;
  routePreview.textContent = getPlayerPath();
}

mediaType.addEventListener('change', updateFormState);
[tmdbId, season, episode].forEach(input => input.addEventListener('input', updateFormState));
updateFormState();

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const id = tmdbId.value.trim();
  if (!/^\d+$/.test(id) || Number(id) < 1) {
    tmdbId.setCustomValidity('Enter a positive numeric TMDB ID.');
    tmdbId.reportValidity();
    return;
  }
  tmdbId.setCustomValidity('');

  const route = getPlayerPath();
  routePreview.textContent = route;
  playerFrame.src = route;
  playerFrame.classList.add('visible');
  playerPlaceholder.classList.add('hidden');
  formStatus.textContent = 'Player launched · ' + (mediaType.value === 'tv' ? `S${season.value || 1}:E${episode.value || 1}` : 'Movie');
});

tmdbId.addEventListener('input', () => tmdbId.setCustomValidity(''));
