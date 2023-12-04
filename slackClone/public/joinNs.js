const joinNs = (element, nsList) => {
  const nsEndpoint = element.getAttribute("ns");

  const clickedNs = nsList.find((row) => row.endpoint === nsEndpoint);
  selectedNsId = clickedNs.id;
  const roomList = document.querySelector(".room-list");
  roomList.innerHTML = "";

  let firstRoom;

  clickedNs.rooms.forEach((room, i) => {
    if (i === 0) {
      firstRoom = room.roomTitle;
    }
    roomList.innerHTML += `
        <li class="room" namespaceId=${
          room.namespaceId
        }><span class="fa-solid fa-${
      room.privateRoom ? "lock" : "globe"
    }"></span>${room.roomTitle}</li>
        `;
  });

  joinRoom(firstRoom, selectedNsId);

  const roomNodes = document.querySelectorAll(".room");
  Array.from(roomNodes).forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const namespaceId = elem.getAttribute("namespaceId");
      joinRoom(e.target.innerText, namespaceId);
    });
  });

  localStorage.setItem("lastNs", nsEndpoint);
};
