function setValues() {
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const location = document.getElementById('location').value;
    const condition = document.getElementById('condition').value;
    const categoriesSelect = document.getElementById('categories');
    const description = document.getElementById('description').value;
    const imageInput = document.getElementById('image');
    const categories = categoriesSelect
        ? Array.from(categoriesSelect.selectedOptions).map(option => option.value)
        : [];

    document.getElementById('theTitle').innerText = title;
    document.getElementById('theDescription').innerText = description;
    document.getElementById('theCondition').innerText = "Condition: " + condition;
    document.getElementById('theCategories').innerText = "Categories: " + categories.join(', ');
    document.getElementById('thePrice').innerText = "Price: $" + price;
    document.getElementById('theLocation').innerText = "Location: " + location;

    const image = imageInput.files[0];
    if (image) {
        const imageUrl = URL.createObjectURL(image);
        document.getElementById('theImage').src = imageUrl;
    }
}
