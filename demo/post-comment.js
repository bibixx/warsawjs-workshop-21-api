(function() {
  document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();

    const body = document.querySelector("#body").value;
    const positionX = document.querySelector("#posX").value;
    const positionY = document.querySelector("#posY").value;
    const id = document.querySelector("#id").value;
    const username = document.querySelector("#username").value;

    fetch(`/posts/${id}/comments`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        username,
        body,
        position: {
          x: positionX,
          y: positionY,
        }
      }),
    });

    return false;
  })
})();