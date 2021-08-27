import React from "react";

import ChatUI, { ExampleComponent } from "chatbotui";
import "chatbotui/dist/index.css";

const App = () => {
  return (
    <>
      <ExampleComponent text="Create React Library Example 😄" />
      <ChatUI />
    </>
  );
};

export default App;
