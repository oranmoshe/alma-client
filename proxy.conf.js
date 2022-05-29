module.exports = [
  {
    context: [
      "/api",
      "/restorepassword",
      "/logout",
      "/registration"
    ],
    target: "http://localhost:8080",
    secure: false
  }
];

