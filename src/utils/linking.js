const config = {
  screens: {
    Signup: {
      path: "Signup/:id",
      parse: {
        id: (id) => `${id}`,
      },
    },
    ChatBox: {
      path: "ChatBox/:id",
      parse: {
        id: (id) => `${id}`,
      },
    },
    Community: {
      path: "Community",
    },
    Home: {
      path: "Home",
    },
  },
};

const linking = {
  prefixes: ["app://"],
  config,
};

export default linking;
