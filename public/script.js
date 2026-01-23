function setValues() {
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const location = document.getElementById('location').value;
    const condition = document.getElementById('condition').value;
    const description = document.getElementById('description').value;
    const imageInput = document.getElementById('item');

    document.getElementById('theTitle').innerText = title;
    document.getElementById('theDescription').innerText = description;
    document.getElementById('theCondition').innerText = "Condition: " + condition;
    document.getElementById('thePrice').innerText = "Price: $" + price;
    document.getElementById('theLocation').innerText = "Location: " + location;

    const image = imageInput.files[0];
    if (image) {
        const imageUrl = URL.createObjectURL(image);
        document.getElementById('theImage').src = imageUrl;
    }
}
