// Game state
const gameState = {
  currentRound: 0,
  totalRounds: 3,
  totalScore: 0,
  guessMarker: null,
  guessLocation: null,
  locations: [
    {
      name: "N Seoul Tower Area",
      lat: 37.5512,
      lng: 126.9882
    },
    {
      name: "Gyeongbokgung Palace Area",
      lat: 37.5796,
      lng: 126.9770
    },
    {
      name: "Haeundae Beach Area",
      lat: 35.1586,
      lng: 129.1604
    }
  ]
};

let roadview, roadviewClient, guessMap;

// Initialize maps
function initMaps() {
  // Ensure container exists
  const roadviewContainer = document.getElementById('roadview');
  if (!roadviewContainer) {
    console.error('Roadview container not found');
    return;
  }

  // Initialize Roadview with explicit options
  const rvOptions = {
    panoId: 0,
    panoX: 0,
    panoY: 0
  };
  
  roadview = new kakao.maps.Roadview(roadviewContainer, rvOptions);
  roadviewClient = new kakao.maps.RoadviewClient();
  
  // Load first location's roadview
  loadRoadview(gameState.currentRound);
  
  // Initialize guess map
  const guessMapContainer = document.getElementById('guessMap');
  if (!guessMapContainer) {
    console.error('Guess map container not found');
    return;
  }
  
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

// Load roadview for a specific location
function loadRoadview(roundIndex) {
  const location = gameState.locations[roundIndex];
  const position = new kakao.maps.LatLng(location.lat, location.lng);
  
  // Get nearest panorama ID and display roadview
  roadviewClient.getNearestPanoId(position, 50, function(panoId) {
    if (panoId) {
      roadview.setPanoId(panoId, position);
    } else {
      console.log('No roadview found within 50m, trying larger radius...');
      // Fallback: try slightly different position with larger radius
      roadviewClient.getNearestPanoId(position, 200, function(altPanoId) {
        if (altPanoId) {
          roadview.setPanoId(altPanoId, position);
        } else {
          console.error('No roadview available at this location');
          alert('No street view available for this location. Skipping to next round.');
          nextRound();
        }
      });
    }
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
  
  // Load next location's roadview
  loadRoadview(gameState.currentRound);
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
