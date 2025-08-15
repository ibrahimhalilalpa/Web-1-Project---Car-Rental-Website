
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    import { getDatabase, set, ref, push, child, onValue, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    window.onload = resfreshtable();
//Araba Listeleme

function resfreshtable() {
    $('#dataTbl td').remove();
    var rowNum = 0;
    const dbRef = ref(database, 'Cars/');

    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            // ...
            rowNum += 1;
            /*var row = "<div class='Car_Box col-sm-4'><div class='Car_Box-img'><img src='./image/Cars/Deductible/D1.jpg' alt='car-image'></div> <div class='Car_Box-CarName'>"
            +childData.CarName+"<div class='CarName'></div>"+"<div class='Car_Box-Detail'><a class='Car_Box_Button'>"
            +childData.CarModel+"</a> <a class='Car_Box_Button'>"
            +childData.CarCategoriType+"</a><a class='Car_Box_Button'> "
            +childData.CarPrice+"</a></div>"
            +childData.CarCategoriType + "</div>"*/
            if(childData.Active == false)
            {
            var row="<div class='Car_Box "+childData.Active+"'> <div class='Car_Box-CarName'> <span class='Car_Box-CarNameH'> "
            +childData.CarName+"</span> </div> <div class='Car_Box-img'> <img src="+childData.image+" alt='car-image'> </div> <div class='Car_Box-Price'> <span class='h3 text-warning'>&euro;"
            +childData.CarPrice+"</span>/Week </div> <div class='Car_Box-Detail'> <ul class='fa-ul'> <li><span class='fa-li'><span class='fas fa-car-side text-warning'></span></span> <strong>"
            +childData.AgeLimit+"</strong> Min Age</li> <li><span class='fa-li'><span class='fas fa-users text-warning'></span></span> <strong>"
            +childData.CarPassenger+"</strong> Passengers</li> <li><span class='fa-li'><span class='fas fa-suitcase text-warning'></span></span> <strong>"
            +childData.CarSuitcase+"</strong> Suitcases</li> <li><span class='fa-li'><i class='fa-solid fa-code-branch text-warning '></i></span></span>"
            +childData.CarGear+"</li> <li><span class='fa-li'><span class='fas fa-gas-pump text-warning'></span></span>"
            +childData.CarFuelType+"</li> <li><span class='fa-li'><i class='fa-sharp fa-solid fa-calendar text-warning'></i></span><strong>"
            +childData.CarModel+"</strong> Model</li> <li><span class='fa-li'><i class='fa-solid fa-bars-staggered text-warning'></i></span>"
            +childData.CarCategoriType+"</li> </ul> </div> <div class='Car_Box-Button'> <button data-key ='" + childKey + "'class='Car_Box-RentBtn' id='RentBtnXXX' name='RentBtn'>Rented</button> </div> </div>";
            }
            else
            var row="<div class='Car_Box "+childData.Active+" '> <div class='Car_Box-CarName'> <span class='Car_Box-CarNameH'> "
            +childData.CarName+"</span> </div> <div class='Car_Box-img'> <img src="+childData.image+" alt='car-image'> </div> <div class='Car_Box-Price'> <span class='h3 text-warning'>&euro;"
            +childData.CarPrice+"</span>/Week </div> <div class='Car_Box-Detail'> <ul class='fa-ul'> <li><span class='fa-li'><span class='fas fa-car-side text-warning'></span></span> <strong>"
            +childData.AgeLimit+"</strong> Min Age</li> <li><span class='fa-li'><span class='fas fa-users text-warning'></span></span> <strong>"
            +childData.CarPassenger+"</strong> Passengers</li> <li><span class='fa-li'><span class='fas fa-suitcase text-warning'></span></span> <strong>"
            +childData.CarSuitcase+"</strong> Suitcases</li> <li><span class='fa-li'><i class='fa-solid fa-code-branch text-warning '></i></span></span>"
            +childData.CarGear+"</li> <li><span class='fa-li'><span class='fas fa-gas-pump text-warning'></span></span>"
            +childData.CarFuelType+"</li> <li><span class='fa-li'><i class='fa-sharp fa-solid fa-calendar text-warning'></i></span><strong>"
            +childData.CarModel+"</strong> Model</li> <li><span class='fa-li'><i class='fa-solid fa-bars-staggered text-warning'></i></span>"
            +childData.CarCategoriType+"</li> </ul> </div> <div class='Car_Box-Button'> <button data-key ='" + childKey + "'class='Car_Box-RentBtn' id='RentBtn' name='RentBtn'>Rent</button> </div> </div>";

            $(row).appendTo('#AllCars');

        });
    }, {
        onlyOnce: true
    });
}


