// Game state
const gameState = {
  currentRound: 0,
  totalRounds: 3,
  totalScore: 0,
  guessMarker: null,
  guessLocation: null,
  locations: [
    {
      name: "N Seoul Tower",
      lat: 37.5512,
      lng: 126.9882,
      zoom: 3
    },
    {
      name: "Gyeongbokgung Palace",
      lat: 37.5796,
      lng: 126.9770,
      zoom: 3
    },
    {
      name: "Haeundae Beach",
      lat: 35.1586,
      lng: 129.1604,
      zoom: 3
    }
  ]
};

let mainMap, guessMap;

// Initialize maps
function initMaps() {
  // Main map (location to guess)
  const mainMapContainer = document.getElementById('mainMap');
  const currentLocation = gameState.locations[gameState.currentRound];
  
  const mainMapOption = {
    center: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
    level: currentLocation.zoom,
    draggable: false,
    zoomable: false
  };
  
  mainMap = new kakao.maps.Map(mainMapContainer, mainMapOption);
  
  // Guess map (for making guesses)
  const guessMapContainer = document.getElementById('guessMap');
  const guessMapOption = {
    center: new kakao.maps.LatLng(36.5, 127.5),
    level: 13
  };
  
  guessMap = new kakao.maps.Map(guessMapContainer, guessMapOption);
  
  // Add click event to guess map
  kakao.maps.event.addListener(guessMap, 'click', function(mouseEvent) {
    const latlng = mouseEvent.latLng;
    placeGuessMarker(latlng);
  });
}

// Place marker on guess map
function placeGuessMarker(latlng) {
  // Remove existing marker
  if (gameState.guessMarker) {
    gameState.guessMarker.setMap(null);
  }
  
  // Create new marker
  gameState.guessMarker = new kakao.maps.Marker({
    position: latlng
  });
  
  gameState.guessMarker.setMap(guessMap);
  gameState.guessLocation = latlng;
  
  // Enable submit button
  document.getElementById('submitGuess').disabled = false;
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}

// Calculate score based on distance
function calculateScore(distance) {
  // Maximum score of 1000 for perfect guess
  // Score decreases with distance
  const maxDistance = 500; // km
  if (distance > maxDistance) return 0;
  
  const score = Math.round(1000 * (1 - distance / maxDistance));
  return Math.max(0, score);
}

// Submit guess
function submitGuess() {
  if (!gameState.guessLocation) return;
  
  const currentLocation = gameState.locations[gameState.currentRound];
  const guessLat = gameState.guessLocation.getLat();
  const guessLng = gameState.guessLocation.getLng();
  
  const distance = calculateDistance(
    currentLocation.lat,
    currentLocation.lng,
    guessLat,
    guessLng
  );
  
  const score = calculateScore(distance);
  gameState.totalScore += score;
  
  // Update UI
  document.getElementById('totalScore').textContent = gameState.totalScore;
  
  // Show result overlay
  showResult(distance, score);
}

// Show result overlay
function showResult(distance, score) {
  const overlay = document.getElementById('resultOverlay');
  document.getElementById('distance').textContent = distance.toFixed(1);
  document.getElementById('roundScore').textContent = score;
  overlay.classList.add('active');
}

// Next round
function nextRound() {
  gameState.currentRound++;
  
  // Hide result overlay
  document.getElementById('resultOverlay').classList.remove('active');
  
  if (gameState.currentRound >= gameState.totalRounds) {
    showFinalResults();
    return;
  }
  
  // Reset for next round
  gameState.guessLocation = null;
  if (gameState.guessMarker) {
    gameState.guessMarker.setMap(null);
    gameState.guessMarker = null;
  }
  
  document.getElementById('submitGuess').disabled = true;
  document.getElementById('currentRound').textContent = gameState.currentRound + 1;
  
  // Update main map to new location
  const currentLocation = gameState.locations[gameState.currentRound];
  const newCenter = new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
  mainMap.setCenter(newCenter);
  mainMap.setLevel(currentLocation.zoom);
}

// Show final results
function showFinalResults() {
  const overlay = document.getElementById('finalOverlay');
  document.getElementById('finalScore').textContent = gameState.totalScore;
  overlay.classList.add('active');
}

// Initialize game
window.onload = function() {
  initMaps();
  
  // Event listeners
  document.getElementById('submitGuess').addEventListener('click', submitGuess);
  document.getElementById('nextRound').addEventListener('click', nextRound);
  document.getElementById('submitGuess').disabled = true;
  
  // Update round counter
  document.getElementById('currentRound').textContent = gameState.currentRound + 1;
};
