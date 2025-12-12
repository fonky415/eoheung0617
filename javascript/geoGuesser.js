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
      zoom: 2
    },
    {
      name: "Gyeongbokgung Palace",
      lat: 37.5796,
      lng: 126.9770,
      zoom: 2
    },
    {
      name: "Haeundae Beach",
      lat: 35.1586,
      lng: 129.1604,
      zoom: 2
    }
  ]
};

let mainMap, guessMap;

// Initialize maps
function initMaps() {
  // Ensure containers exist
  const mainMapContainer = document.getElementById('roadview');
  const guessMapContainer = document.getElementById('guessMap');
  
  if (!mainMapContainer || !guessMapContainer) {
    console.error('Map containers not found');
    return;
  }

  // Main map (location to guess) - zoomed in with no controls
  const currentLocation = gameState.locations[gameState.currentRound];
  const mainMapOption = {
    center: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
    level: currentLocation.zoom,
    draggable: true,  // Allow panning to explore
    scrollwheel: true, // Allow zoom
    disableDoubleClick: false,
    disableDoubleClickZoom: false
  };
  
  mainMap = new kakao.maps.Map(mainMapContainer, mainMapOption);
  
  // Hide map controls for challenge
  mainMap.setZoomable(true);
  mainMap.setDraggable(true);
  
  // Guess map (for making guesses)
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

// Update main map to new location
function loadNewLocation(roundIndex) {
  const location = gameState.locations[roundIndex];
  const position = new kakao.maps.LatLng(location.lat, location.lng);
  
  mainMap.setCenter(position);
  mainMap.setLevel(location.zoom);
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
  
  // Load next location
  loadNewLocation(gameState.currentRound);
}

// Show final results
function showFinalResults() {
  const overlay = document.getElementById('finalOverlay');
  document.getElementById('finalScore').textContent = gameState.totalScore;
  overlay.classList.add('active');
}

// Initialize game when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

function initGame() {
  // Wait for Kakao Maps API to load
  if (typeof kakao !== 'undefined' && kakao.maps) {
    // Give the DOM a moment to fully render
    setTimeout(function() {
      initMaps();
      
      // Event listeners
      document.getElementById('submitGuess').addEventListener('click', submitGuess);
      document.getElementById('nextRound').addEventListener('click', nextRound);
      document.getElementById('submitGuess').disabled = true;
      
      // Update round counter
      document.getElementById('currentRound').textContent = gameState.currentRound + 1;
    }, 100);
  } else {
    console.error('Kakao Maps API not loaded');
    alert('Failed to load Kakao Maps. Please refresh the page.');
  }
}
