"use client";

import React from "react";
import UniversalPageLayout from "../../components/Layout/UniversalPageLayout";


/** 3. Boost Page */
export function BoostPageContainer() {
  return (
    <UniversalPageLayout
      mainContent={<div>💥 BoostPage — confirm + trigger boost</div>}
      sidebarContent={<Sidebar />}
    />
  );
}
