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

    //set the visual properties
    li.setAttribute('data-id', doc.id);
    place.textContent = doc.data().Place;
    city.textContent = doc.data().City;
    interestingFact.textContent = doc.data().interestingFact;
    cross.textContent = 'x';

    //add the items set above to the list item 'li'
    li.appendChild(place)
    li.appendChild(city)
    li.appendChild(interestingFact)
    li.appendChild(cross)

    //append the list item to the list of list items
    placesList.appendChild(li)

    //deletingPlaces added to each list
    cross.addEventListener('click', (e) =>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('places').doc(id).delete();
    })

}


//get docs from firestore
db.collection('places').where('City', '>', 'A').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        //for each item, render it in the list
        renderPlaces(doc)
    })
})


//saving document to collection

form.addEventListener('submit',(e) =>{
    e.preventDefault();

    //pass a JSON object 
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