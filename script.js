function setValues() {
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const location = document.getElementById('location').value;
    const condition = document.getElementById('condition').value;
    const description = document.getElementById('description').value;

    const post =  `${title} \n ${description} \n ${condition} \n ${price} \n ${location}`;
    document.getElementById('postResult').innerText = post ;
}
