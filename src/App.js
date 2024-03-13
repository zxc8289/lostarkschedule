import React, { useEffect } from "react";
import NavBar from "./componnent/navbar/navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PatchLog from "./screen/patchLog";
import RiceCalculator from "./screen/riceCalculator";
import Login from "./screen/login/login";
import Home from "./screen/home/home";
import ApiKeyformUpdateForm from "./componnent/apikeyform/apiKeyformUpdateForm";
import ScheduleGroupCreator from "./screen/scheduleGroupCreator/scheduleGroupCreator";
import WeeklyGroupCreator from "./screen/groupCreator/weeklyGroupCreator";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patchlog" element={<PatchLog />} />
        {/* <Route path="/ricecalculator" element={<RiceCalculator />} /> */}
        <Route path="/schedulegroupcreator" element={< ScheduleGroupCreator />} />
        <Route path="/weeklygroupcreator" element={< WeeklyGroupCreator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/apikeyupdate" element={<ApiKeyformUpdateForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
