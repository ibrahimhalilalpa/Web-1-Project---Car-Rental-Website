import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getDatabase, ref, set, child, get, update, remove, onValue }
  from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";




const firebaseConfig = {
  apiKey: "AIzaSyAdGhUjTZuzmk7GQlmmIJR3qnSvUbu3Fo0",
  authDomain: "alparentacar-e35c4.firebaseapp.com",
  projectId: "alparentacar-e35c4",
  storageBucket: "alparentacar-e35c4.appspot.com",
  messagingSenderId: "230825226127",
  appId: "1:230825226127:web:6493468d74ef155ab465fa",
  measurementId: "G-29VF6RPVX4"
};



const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);


CarPriceBtn.addEventListener('click', (e) => {

  var CarId = window.localStorage.getItem("CarID");
  var UserId = window.localStorage.getItem("UserId");
  var Day = window.localStorage.getItem("Day");


  var FromWhere = document.getElementById('FromWhere').value;
  var ToWhere = document.getElementById('ToWhere').value;
  //var DateRange = document.getElementById('DateRange').textContent;


  var FirstName = document.getElementById('FirstNameId').value;
  var LastName = document.getElementById('LastNameId').value;
  var TC = document.getElementById('TCId').value;
  var Age = document.getElementById('AgeId').value;
  var License = document.getElementById('LicenseId').value;

  var Email = document.getElementById('EmailId').value;
  var Phone = document.getElementById('PhoneId').value;
  var Address = document.getElementById('AddressId').value;


  console.log(UserId);


  get(child(dbRef, 'CounterRent/')).then((snapshot) => {
    var RentingCounter = Number(snapshot.val());
    RentingCounter += 1;

    console.log(RentingCounter)

    get(child(dbRef, 'Users/' + UserId + '/rentcount/')).then((snapshot) => {
      var rentcount = snapshot.val();
      rentcount += 1;
      console.log(rentcount)

      if (rentcount >= 3)
        alert("You cannot rent a new car. Your right to rent a car is three. Deliver what you have first!")
      else {

        update(ref(database, '/'), { CounterRent: RentingCounter });
        update(ref(database, 'Cars/' + CarId + '/'), { Active: false });

        set(ref(database, 'Renting/' + RentingCounter), {
          FromWhere: FromWhere,
          ToWhere: ToWhere,
          SumofDay: Day,

          FirstNameId: FirstName,
          LastNameId: LastName,
          TCId: TC,
          AgeId: Age,
          LicenseId: License,

          Email: Email,
          Phone: Phone,
          Address: Address,

          Car: CarId,
          User: UserId
        });



        console.log(rentcount);
        update(ref(database, 'Users/' + UserId + '/'), { rentcount: rentcount });
        swal({
          title: "Car rental successful!",
          icon: "success",
        });
      }



    });

  });

});
