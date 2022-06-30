module.exports = [
  {
    context: [
      "/api",
      "/restorepassword",
      "/logout",
      "/registration"
    ],
    target: "https://alma-app-server.herokuapp.com",
    secure: false
  }
];

