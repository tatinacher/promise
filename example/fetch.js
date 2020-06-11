const { Promise } = require("../");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const fetch = url => {
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.onload = function() {
      if (request.status === 200) {
        resolve(request.responseText);
      } else {
        reject(
          Error(
            "Data didn't load successfully; error code:" + request.statusText
          )
        );
      }
    };
    request.onerror = function() {
      reject(Error("There was a network error."));
    };
    request.send();
  });
};

fetch("https://jsonplaceholder.typicode.com/users")
  .then(
    data => {
      return JSON.parse(data);
    },
    data => {
      return data;
    }
  )
  .then(
    data => {
      const user = data.find(user => user.username === "Delphine");
      console.log(user);
    },
    data => {
      console.log(data);
    }
  );
