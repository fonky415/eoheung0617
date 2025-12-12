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

let panorama, map, sv, apiKey;

// Check for saved API key
function checkApiKey() {
  apiKey = localStorage.getItem('googleMapsApiKey');
  
  if (!apiKey) {
    document.getElementById('apiKeyPrompt').classList.add('active');
    document.getElementById('saveApiKey').addEventListener('click', function() {
      const inputKey = document.getElementById('apiKeyInput').value.trim();
      if (inputKey) {
        localStorage.setItem('googleMapsApiKey', inputKey);
        apiKey = inputKey;
        document.getElementById('apiKeyPrompt').classList.remove('active');
        loadGoogleMapsScript();
      } else {
        alert('Please enter a valid API key');
      }
    });
  } else {
    loadGoogleMapsScript();
  }
}

// Load Google Maps script
function loadGoogleMapsScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGame`;
  script.async = true;
  script.defer = true;
  script.onerror = function() {
    alert('Failed to load Google Maps. Please check your API key and try again.');
    localStorage.removeItem('googleMapsApiKey');
    location.reload();
  };
  document.head.appendChild(script);
}

// Initialize game
function initGame() {
  // Initialize Street View
  const streetviewContainer = document.getElementById('streetview');
  const currentLocation = gameState.locations[gameState.currentRound];
  
  panorama = new google.maps.StreetViewPanorama(streetviewContainer, {
    position: { lat: currentLocation.lat, lng: currentLocation.lng },
    pov: { heading: 34, pitch: 10 },
    zoom: 1,
    addressControl: false,
    showRoadLabels: false,
    zoomControl: true,
    panControl: true,
    enableCloseButton: false
  });
  
  // Initialize guess map
  const mapContainer = document.getElementById('guessMap');
  map = new google.maps.Map(mapContainer, {
    center: { lat: 36.5, lng: 127.5 },
    zoom: 7,
    mapTypeControl: false
  });
  
  // Add click listener to guess map
  map.addListener('click', function(e) {
    placeGuessMarker(e.latLng);
  });
  
  // Street View service for finding panoramas
  sv = new google.maps.StreetViewService();
  
  // Event listeners
  document.getElementById('submitGuess').addEventListener('click', submitGuess);
  document.getElementById('nextRound').addEventListener('click', nextRound);
  document.getElementById('submitGuess').disabled = true;
  
  // Update round counter
  document.getElementById('currentRound').textContent = gameState.currentRound + 1;
}

// Load new location
function loadNewLocation(roundIndex) {
  const location = gameState.locations[roundIndex];
  const position = { lat: location.lat, lng: location.lng };
  
  // Find nearest Street View panorama
  sv.getPanorama({ location: position, radius: 50 }, function(data, status) {
    if (status === 'OK') {
      panorama.setPano(data.location.pano);
      panorama.setPov({ heading: 34, pitch: 10 });
      panorama.setVisible(true);
    } else {
      // Fallback to position
      panorama.setPosition(position);
    }
  });
}

// Place marker on guess map
function placeGuessMarker(latLng) {
  // Remove existing marker
  if (gameState.guessMarker) {
    gameState.guessMarker.setMap(null);
  }
  
  // Create new marker
  gameState.guessMarker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  
  gameState.guessLocation = latLng;
  
  // Enable submit button
  document.getElementById('submitGuess').disabled = false;
}

// Calculate distance using Haversine formula
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
  const maxDistance = 500; // km
  if (distance > maxDistance) return 0;
  
  const score = Math.round(1000 * (1 - distance / maxDistance));
  return Math.max(0, score);
}

// Submit guess
function submitGuess() {
  if (!gameState.guessLocation) return;
  
  const currentLocation = gameState.locations[gameState.currentRound];
  const guessLat = gameState.guessLocation.lat();
  const guessLng = gameState.guessLocation.lng();
  
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

// Start the app
checkApiKey();
