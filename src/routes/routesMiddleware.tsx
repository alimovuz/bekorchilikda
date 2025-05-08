import { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { sidebar_routes } from ".";
import Layout from "../components/layout";
import React from "react";

const RoutesMiddleware = () => {
  const createComponent = (Component: any): ReactNode => {
    return (
      <>
        <Component />
      </>
    );
  };
  return (
    <Layout>
      <Routes>
        {sidebar_routes?.map((item) => (
          <Route
            key={item?.path}
            path={item?.path}
            element={createComponent(item?.component)}
          />
        ))}
        <Route path={`*`} element={<Navigate to={"/dashboard"}/>} />
      </Routes>
    </Layout>
  );
};

export default React.memo(RoutesMiddleware);
