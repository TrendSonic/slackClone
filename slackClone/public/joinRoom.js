const joinRoom = async (roomTitle, namespaceId) => {
  console.log(roomTitle, namespaceId);

  const ackResp = await namespaceSockets[namespaceId].emitWithAck("joinRoom", {
    roomTitle,
    namespaceId,
  });

  document.getElementById("messages").innerHTML = "";
  ackResp.thisRoomsHistory.forEach((message) => {
    document.getElementById("messages").innerHTML = buildMessageHtml(message);
  });

  console.log(ackResp);
  document.querySelector(
    ".curr-room-num-users"
  ).innerHTML = `${ackResp.numUsers}<span class="fa-solid fa-user"></span>`;
  document.querySelector(".curr-room-text").innerHTML = roomTitle;
};
