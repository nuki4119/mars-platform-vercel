"use client";

import React from "react";
import UniversalPageLayout from "../../components/Layout/UniversalPageLayout";
import Sidebar from "../../components/Layout/Sidebar"; // <- don't forget this!

/** 3. Boost Page */
function BoostPageContainer() {
  return (
    <UniversalPageLayout
      mainContent={<div>💥 BoostPage — confirm + trigger boost</div>}
      sidebarContent={<Sidebar />}
    />
  );
}

export default BoostPageContainer;
