import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB13nQhy8bB45fOCjpqltDbIkOfeY7ojsY',
  authDomain: 'bookshoponline-85349.firebaseapp.com',
  projectId: 'bookshoponline-85349',
  storageBucket: 'bookshoponline-85349.appspot.com',
  messagingSenderId: '272223256708',
  appId: '1:272223256708:web:c9bc24e8935093dd7742d1',
  measurementId: 'G-5QRRSHZHTP',
  databaseURL:
    'https://bookshoponline-85349-default-rtdb.asia-southeast1.firebasedatabase.app/'
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
