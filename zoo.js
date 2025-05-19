// zoo.js - Central initialization for Zoo Management System
import { initSecurity, verifySecureProtocol } from './Security.js';
import { initializeMembershipForm, setupBookingForm, setupMembershipForm } from './formsubmission.js';
import { populateAnimalDropdown, loadAnimals, displayAnimalData, animals, displayAnimals } from './AnimalData.js';
import { toggleZooStatus, updateVisitorCount, displayZooStatistics, toggleAnimalHealth, toggleAnimalStatus } from './ZooOperations.js';
import { updateAdminDashboard } from './AdminDashboard.js';
import { displayError, displaySuccess } from './UiFeedback.js';
import { exhibits, emergencyStations } from './zooLocations.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Zoo Management System Loaded');

  try {
    // Security verification
    if (!verifySecureProtocol()) return;

    // Initialize CSRF tokens and security for forms
    initSecurity();

    // Load existing animals and populate dropdown
    loadAnimals();
    populateAnimalDropdown(animals);
    displayAnimalData(animals);

    // Setup form event listeners
    initializeMembershipForm();
    setupMembershipForm();
    setupBookingForm();

    // Admin dashboard real-time updates
    updateAdminDashboard();

    // Attach global functions for buttons
    window.toggleZooStatus = () => {
      const zooStatusElement = document.getElementById("zooStatus");
      const currentStatus = zooStatusElement.textContent.includes('Open') ? 'Open' : 'Closed';
      const updatedStatus = toggleZooStatus(currentStatus, animals);
      displayAnimals(updatedStatus.animals); // Refresh animal cards
    };

    window.toggleStatus = (id) => {
      toggleAnimalStatus(id, animals);
    };
    
    window.updateHealth = (id) => {
      toggleAnimalHealth(id, animals);
    };    

    window.displayZooStatistics = () => {
      displayZooStatistics(animals);
    };

    window.updateVisitorCount = (count) => {
      updateVisitorCount(count);
    };

    window.toggleStatus = (id) => {
  toggleAnimalStatus(id, animals);
  const updatedAnimal = animals.find(a => a.id === id);
  if (updatedAnimal) {
    import('./AnimalData.js').then(({ notifyAnimalStatusChange }) => {
      notifyAnimalStatusChange(updatedAnimal);
    });
  }
};

    // Error and success messaging
    window.displayError = displayError;
    window.displaySuccess = displaySuccess;

    console.group("📍 Geolocation Data");
    console.table(exhibits);
    console.table(emergencyStations);
    console.groupEnd();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
      .then(() => console.log("Service Worker registered"))
      .catch((err) => console.error("SW registration failed", err));
    }


  } catch (error) {
    console.error("Critical Error: Unable to initialize Zoo Management System.", error);
    displayError("A serious error occurred. Please reload the page.");
  }
});

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("🟢 Notification permission granted");
    }
  });
}