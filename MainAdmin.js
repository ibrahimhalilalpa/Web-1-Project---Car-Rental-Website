import { initializeApp } 
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, set, ref, push, child, onValue, get, update,remove } 
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL }
  from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
window.onload = GetttingCarsData();
window.onload = GetttingUsersData();




/**********************Gettting Cars Data******************************/

function GetttingCarsData() {
    $('#dataTbl td').remove();
    var rowNum = 0;
    const dbRef = ref(database, 'Cars/');

    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();

           /* var CarStatusBtn = "<button class='CarStatusBtn' data-key='" + childKey + "' data-active='" + childData.Active + "'>Change Status</button>"*/
            var CarStatusBtn = "<button class='CarStatusBtn' data-key='" + childKey + "' data-active='" + childData.Active + "'>Change Status</button>";

            var StatusCar = "Not Rented";
            
            if (childData.Active == false) {
              StatusCar = 'Rented';
            }
            if (childData.Active == true) {
              StatusCar = 'Not Rented';
            }

            // ...
            rowNum += 1;
            var row = "<tr><td>" +
                rowNum + "</td><td>" +
                childData.CarID + "</td><td>" +
                childData.CarName + "</td><td>" +
                childData.CarModel + "</td><td>" +
                childData.CarPrice + "</td><td>" +
                childData.AgeLimit + "</td><td>" +
                childData.CarPassenger + "</td><td>" +
                childData.CarSuitcase + "</td><td>" +
                childData.CarGear + "</td><td>" +
                childData.CarFuelType + "</td><td>" +
                childData.CarCategoriType + "</td><td>" +
                StatusCar + "</td><td>" +
                CarStatusBtn + "</td></tr>";

            $(row).appendTo('#dataTbl');

        });
    }, {
        onlyOnce: true
    });

}


$("body").on("click", ".CarStatusBtn", function () {
  var $key = $(this).data("key");
  //console.log($key);
  var $active = $(this).data('active');
  if($active == true)
  {
    update(ref(database, "Cars/" + $key), { Active: false })
    //remove(ref(database, "Renting/" + $key))
    alert('The car has been added to the rental list.');

  }

  if ($active == false)
  {
    update(ref(database, "Cars/" + $key), { Active: true})
    alert('Car has been removed from the rental list');

  }
  GetttingCarsData();
})



/**********************Gettting Users Data******************************/

function GetttingUsersData() {
    $('#dataTblUser td').remove();
    var rowNum = 0;
    const dbRef = ref(database, 'Users/');

    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            rowNum += 1;

            var TableButton = "<button id='TableButton' class='TableButton' data-key ='" + childKey + "' data-userrank = '" + childData.rank + "'>Change Rank</button>"

            // ...
            var RankName;
            if (childData.rank == '1') {
                RankName = 'Admin';
            }
            if (childData.rank == '0') {
                RankName = 'User';
            }


            var row = "<tr><td>" +
                rowNum + "</td><td>" +
                childData.username + "</td><td>" +
                childData.email + "</td><td>" +
                childData.last_login + "</td><td>" +
                RankName + "</td><td>" +
                TableButton + "</td></tr>"
            $(row).appendTo('#dataTblUser');
            //console.log(childKey);


        });
    }, {
        onlyOnce: true
    });
}



$("body").on("click", ".TableButton", function () {
  var $key = $(this).data("key");
  //console.log($key);
  var $userrank = $(this).data('userrank');
  if ($userrank == '0')
      update(ref(database, "Users/" + $key), { rank: '1' })
  if ($userrank == '1')
      update(ref(database, "Users/" + $key), { rank: '0' })
  alert('Rank is changed.')
  GetttingUsersData();
})





/************************CAR MANEGMENT JS***********************************



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


const dbRef = ref(database);


//----------------------------variables and references--------------------------------//


var files = [];
var reader = new FileReader();

var CarImageName = document.getElementById('CarImageName');
var extlab = document.getElementById('extlab');
var CarImage = document.getElementById('CarImage');
var selbtn = document.getElementById('selbtn');

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



//----------------------------functions for realtime database---------------//




//can't contain "." , "#" ,"$" ,"["or "]"

function ValidateName() {
  var regex = /[\.#$\[\]]/
  return !(regex.test(CarImageName.value));
}


//upbtn.onclick = UploadProcess;


//---------------------------------------adding process---------------------------------///

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
  

  var ImgToUpload = files[0];
  var ImgName = CarImageName.value + extlab.innerHTML;




  if (!ValidateName()) {
    alert('Name connot contain "." , "#" ,"$" ,"["or "]"');
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
        CarCategoriType: CarCategoriType    
      });    
    });

  
  alert('Data added!');

});




//---------------------------------------update process---------------------------------///



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




  alert('Data updated!');
});


//---------------------------------------deleting process---------------------------------///

btnDelete.addEventListener('click', (e) => {
  var CarID = document.getElementById('CarID').value;

  remove(ref(database, 'Cars/' + CarID));
  alert('Data deleted!');
});



//---------------------------------------getting process---------------------------------///

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
  alert("Data called!");

});


