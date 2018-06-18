(function() {
  document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData();
    const fileInputElement = document.querySelector("#image");
    const bodyInputElement = document.querySelector("#body");

    formData.append("username", "Groucho");
    formData.append("title", bodyInputElement.value);

    formData.append("image", fileInputElement.files[0]);

    for (const pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
    }

    fetch("http://localhost:3000/posts/", {
      method: 'POST',
      body: formData,
    });

    return false;
  })
})();