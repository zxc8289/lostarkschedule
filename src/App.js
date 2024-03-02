import React from "react";
import NavBar from "./componnent/navbar/navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PatchLog from "./screen/patchLog";
import RiceCalculator from "./screen/riceCalculator";
import Login from "./screen/login/login";

import GroupCreator from "./screen/groupCreator/groupCreator";
import Home from "./screen/home/home";
import ApiKeyformUpdateForm from "./componnent/apikeyform/apiKeyformUpdateForm";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patchlog" element={<PatchLog />} />
        <Route path="/ricecalculator" element={<RiceCalculator />} />
        <Route path="/raidschedulecreator" element={< GroupCreator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/apikeyupdate" element={<ApiKeyformUpdateForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
