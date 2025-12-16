"use client";

import React from "react";
import UniversalPageLayout from "../../components/Layout/UniversalPageLayout";
import Sidebar from "../../components/Layout/Sidebar";

/** 3. Boost Page */
function BoostPageContainer() {
  return (
    <UniversalPageLayout
      mainContent={<div>💥 BoostPage — confirm + trigger boost</div>}
      rightContent={<Sidebar />}  // ✅ THIS IS CORRECT
    />
  );
}

export default BoostPageContainer;
