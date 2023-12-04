// const userName = prompt("Username");
// const password = prompt("Password");
const userName = "test";
const password = "test";

const clientOptions = {
  auth: {
    userName,
    password,
  },
};

const socket = io("http://localhost:9000", clientOptions);

const namespaceSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};

let selectedNsId = 0;
document.getElementById("message-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const newMessage = document.getElementById("user-message").value;
  if (newMessage) {
    namespaceSockets[selectedNsId].emit("newMessageToRoom", {
      newMessage,
      date: Date.now(),
      avatar: "https://via.placeholder.com/30",
      userName,
      selectedNsId,
    });
    document.getElementById("user-message").value = "";
  }
});

const addListeners = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    namespaceSockets[nsId].on("nsChange", (data) => {
      console.log("Namespace chagned!");
      console.log(data);
    });
  }
  if (!listeners.messageToRoom[nsId]) {
    namespaceSockets[nsId].on("messageToRoom", (messageObj) => {
      console.log(messageObj);
      document.getElementById("messages").innerHTML +=
        buildMessageHtml(messageObj);
    });
    listeners.messageToRoom[nsId] = true;
  }
};

socket.on("connect", () => {
  console.log("Connected");
  socket.emit("clientConnect");
});

socket.on("nsList", (nsList) => {
  const lastNs = localStorage.getItem("lastNs");
  const namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsList.forEach((ns) => {
    namespacesDiv.innerHTML += `
    <div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>
    `;

    if (!namespaceSockets[ns.id]) {
      namespaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
    }

    addListeners(ns.id);
  });

  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      element.addEventListener("click", (e) => {
        joinNs(element, nsList);
      });
    }
  );

  joinNs(
    lastNs
      ? document.querySelector(`[ns="${lastNs}"]`)
      : document.getElementsByClassName("namespace")[0],
    nsList
  );
});
