// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";

import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL }
  from "https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js";

import { getDatabase, ref, set, child, get, update, remove, onValue }
  from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";


// Your web app's Firebase configuration


/*
var firebaseConfig = {
  apiKey: "AIzaSyD8huoUJahSSgfeVrduetfga8VcAn3ohUA",
  authDomain: "rent-car-b7bab.firebaseapp.com",
  projectId: "rent-car-b7bab",
  storageBucket: "rent-car-b7bab.appspot.com",
  messagingSenderId: "307208189325",
  appId: "1:307208189325:web:49734a018255314d7039c4"
};*/


// Initialize Firebase


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);


//----------------------------variables and references--------------------------------//


var files = [];
var reader = new FileReader();

var CarImageName = document.getElementById('CarImageName');
var extlab = document.getElementById('extlab');
var CarImage = document.getElementById('CarImage');
var selbtn = document.getElementById('selbtn');
var downbtn = document.getElementById('downbtn');

var input = document.createElement('input');
input.type = 'file';


input.onchange = e => {
  files = e.target.files;
  var extention = GetFileExt(files[0]);
  var name = GetFileName(files[0]);

  CarImageName.value = name;
  extlab.innerHTML = extention;

  reader.readAsDataURL(files[0]);
}

reader.onload = function () {
  CarImage.src = reader.result;
}
//-----------------------------------selection----------------//

selbtn.onclick = function () {
  input.click();
}


function GetFileExt(file) {
  var temp = file.name.split('.');
  var ext = temp.slice((temp.length - 1), (temp.length));
  return '.' + ext[0];
}

function GetFileName(file) {
  var temp = file.name.split('.');
  var fname = temp.slice(0, -1).join('.');
  return fname;
}

//---------------------------------------upload process-------------///

var counter;


btnAdd.addEventListener('click', (e) => {
  var CarID = document.getElementById('CarID').value;
  var CarName = document.getElementById('CarName').value;
  var CarModel = document.getElementById('CarModel').value;
  var CarPrice = document.getElementById('CarPrice').value;

  var AgeLimit = document.getElementById('AgeLimit').value;
  var CarPassenger = document.getElementById('CarPassenger').value;
  var CarSuitcase = document.getElementById('CarSuitcase').value;
  var CarGear = document.getElementById('CarGear').value;

  var CarFuelType = document.getElementById('CarFuelType').value;
  var CarCategoriType = document.getElementById('CarCategoriType').value;

  //var CarImageName = document.getElementById('CarImageName').value;
  var CarImage = document.getElementById('CarImage').value;

  var ImgToUpload = files[0];
  var ImgName = CarImageName.value + extlab.innerHTML;

  if (!ValidateName()) {
    alert('Name connot contain "#" ,"$" ,"["or "]"');
    return;
  }

  const metaData = {contentType: ImgToUpload.type}
  const storage = getStorage();
  const storageRef = sRef(storage, "Images/" +"CarId:" +CarID +"--Carname:"+ CarName+ "**"+ ImgName);
  const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);

const namefinal = CarName + "--"+ CarID;



    get(child(dbRef, 'Counter/')).then((snapshot) => {
      counter = Number(snapshot.val());
      counter += 1;
      alert('Car ID:' +  counter);

      update(ref(database, '/'), { Counter: counter });

      uploadBytesResumable(storageRef,namefinal, metaData)
      .then((snapshot) => {
          console.log('Uploaded', snapshot.totalBytes, 'bytes.');
          console.log('File metadata:', snapshot.metadata);
          // Let's get a download URL for the file.
          getDownloadURL(snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
      
              set(ref(database, 'Cars/' + counter + '/image'), downloadURL);
          });
      }).catch((error) => {
          console.error('Upload failed', error);
          // ...
      }
      );

      update(ref(database, 'Cars/' + counter), {

        CarID: counter,
        CarName: CarName,
        CarModel: CarModel,
        CarPrice: CarPrice,
    
        AgeLimit: AgeLimit,
        CarPassenger: CarPassenger,
        CarSuitcase: CarSuitcase,
        CarGear: CarGear,
    
        CarFuelType: CarFuelType,
        CarCategoriType: CarCategoriType,
    
        //CarImageName:CarImageName,
        //CarImage:CarImage
    
      });    
    });

  
  alert('Kayıt oluşturuldu.');

});





//----------------------------functions for realtime database---------------//


function GetUrlfromRealtimeDB() {
  var name = CarImageName.value;
  var dbRef = ref(database);

  get(child(dbRef, "Images/" + name)).then((snapshot) => {
    if (snapshot.exists()) {
      CarImage.src = snapshot.val().ImgUrl;
    }
  })
}

//can't contain "." , "#" ,"$" ,"["or "]"

function ValidateName() {
  var regex = /[\.#$\[\]]/
  return !(regex.test(CarImageName.value));
}


//upbtn.onclick = UploadProcess;
downbtn.onclick = GetUrlfromRealtimeDB;



btnGet.addEventListener('click', (e) => {

  var CarID = document.getElementById('CarID').value;

  const starCountRef = ref(database, 'Cars/' + CarID);
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val(); // data = all data on firebsex 
    document.getElementById('CarID').value = data.CarID;
    document.getElementById('CarName').value = data.CarName;
    document.getElementById('CarModel').value = data.CarModel;
    document.getElementById('CarPrice').value = data.CarPrice;

    document.getElementById('AgeLimit').value = data.AgeLimit;
    document.getElementById('CarPassenger').value = data.CarPassenger;
    document.getElementById('CarSuitcase').value = data.CarSuitcase;
    document.getElementById('CarGear').value = data.CarGear;

    document.getElementById('CarFuelType').value = data.CarFuelType;
    document.getElementById('CarCategoriType').value = data.CarCategoriType;

    document.getElementById('CarImage').src = data.image;
  });
  alert("Veriler Alındı");

});



btnDelete.addEventListener('click', (e) => {
  var CarID = document.getElementById('CarID').value;

  remove(ref(database, 'Cars/' + CarID));
  alert('Veri silindi');
});


btnUpdate.addEventListener('click', (e) => {
  var CarID = document.getElementById('CarID').value;
  var CarName = document.getElementById('CarName').value;
  var CarModel = document.getElementById('CarModel').value;
  var CarPrice = document.getElementById('CarPrice').value;

  var AgeLimit = document.getElementById('AgeLimit').value;
  var CarPassenger = document.getElementById('CarPassenger').value;
  var CarSuitcase = document.getElementById('CarSuitcase').value;
  var CarGear = document.getElementById('CarGear').value;

  var CarFuelType = document.getElementById('CarFuelType').value;
  var CarCategoriType = document.getElementById('CarCategoriType').value;

  update(ref(database, 'Cars/' + CarID), {
    CarID: CarID,
    CarName: CarName,
    CarModel: CarModel,
    CarPrice: CarPrice,

    AgeLimit: AgeLimit,
    CarPassenger: CarPassenger,
    CarSuitcase: CarSuitcase,
    CarGear: CarGear,

    CarFuelType: CarFuelType,
    CarCategoriType: CarCategoriType

  })
  alert('Veriler güncellendi');
});










/*
firebase.auth().onAuthStateChanged(function(users)

if(users)
{
  $(".user-text").text(users.email);
}
)*/

///Background color
/*
colorbtn.addEventListener('click',(e)=>
{
    document.getElementById('colorbtn').style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
});*/

/*
//time

function funcTime()
  {
    var time_ = new Date().getDate();
    console.log(time_);
  }
*/