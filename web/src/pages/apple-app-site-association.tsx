import { NextPage } from "next";
import React from "react";

const AppAssociation: NextPage<{}> = () => {
  return <></>;
};

AppAssociation.getInitialProps = (ctx) => {
  ctx.res?.setHeader("Content-Type", "application/json; charset=utf-8");
  ctx.res?.write('{"webcredentials":{"apps":["AZLX5H46ZL.app.dayto.dayto"]}}');
  ctx.res?.end();
  return {};
};

export default AppAssociation;
