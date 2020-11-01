const placesList = document.querySelector('#places-list')
const form = document.querySelector('#add-places-form') 


//create eleement and render places
function renderPlaces(doc){

    //create the visual components
    let li = document.createElement('li');;
    let place = document.createElement('span');
    let city = document.createElement('span');
    let interestingFact = document.createElement('span');
    let cross = document.createElement('div');
    let button = document.createElement('button')
    let input = document.createElement('input')
    

    //set the visual properties
    li.setAttribute('data-id', doc.id);
    place.textContent = doc.data().Place;
    city.textContent = doc.data().City;
    interestingFact.textContent = doc.data().interestingFact;
    cross.textContent = 'x';
    button.textContent = 'edit';
    input.placeholder = 'typeshithere'
    input.setAttribute("id", doc.id)
    let inputID = doc.id;


    //add the items set above to the list item 'li'
    li.appendChild(place)
    li.appendChild(city)
    li.appendChild(interestingFact)
    li.appendChild(cross)
    li.appendChild(button)
    li.appendChild(input)


    //append the list item to the list of list items
    placesList.appendChild(li)

    //DELETE
    cross.addEventListener('click', (e) =>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('places').doc(id).delete();
    })



    //UPDATE. we add this listner to every editx' button
    button.addEventListener('click', (e) => {

        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('places').doc(id).update({
            interestingFact: document.getElementById(inputID).value
        })
        document.getElementById(inputID).value = ""
    })
}



/*
//get docs from firestore
db.collection('places').where('City', '>', 'A').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        //for each item, render it in the list
        renderPlaces(doc)
    })
})
*/

//saving document to collection

form.addEventListener('submit',(e) =>{
    e.preventDefault();

    //CREATE
    db.collection('places').add({
        Place: form.place.value,
        City: form.city.value,
        interestingFact: form.interestingFact.value
    });

    //clear inputs
    form.place.value = '';
    form.city.value = '';
    form.interestingFact.value = '';
})




//READ IN REALTIME
db.collection('places').orderBy('City').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type === 'added'){
            //if something was added, 
            renderPlaces(change.doc);
            console.log(change.doc)
        } else if (changes.type == 'modified') {
            //this should probably be looked at. im not sure if this actually updates a list item or just adds a new, modified list item
            renderPlaces(change.doc);
        } else if (change.type ==='removed') {
            //if item was deleted, remove that item
            let li = placesList.querySelector('[data-id=' + change.doc.id + ']');
            placesList.removeChild(li);
        } 
    })
})