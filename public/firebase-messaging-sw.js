importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js',
)
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js',
)

firebase.initializeApp({
  apiKey: 'AIzaSyBz2mDITFzgFpp9dKU6UpWQ15g6xJ_k3uI',
  authDomain: 'wavecom-notification.firebaseapp.com',
  projectId: 'wavecom-notification',
  storageBucket: 'wavecom-notification.firebasestorage.app',
  messagingSenderId: '272350147509',
  appId: '1:272350147509:web:c1ae74aa8da050e72d9ffc',
})

// Calling messaging() is what lets Firebase display background notifications.
// Your backend sends a `notification` payload, so Firebase shows it and
// applies the icon you set on the backend.
firebase.messaging()