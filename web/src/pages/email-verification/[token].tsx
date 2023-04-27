import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useVerifyEmailMutation } from "../../generated/graphql";

const VerifyEmail: NextPage = () => {
  const router = useRouter();
  const token = router.query.token;
  const [isVerified, setIsVerified] = useState(false);
  const [verifyEmail] = useVerifyEmailMutation();
  useEffect(() => {
    (async () => {
      if (token) {
        await verifyEmail({ variables: { token: token as string } });
        setIsVerified(true);
      }
    })();
  });
  if (!isVerified) {
    return <h1>Loading...</h1>;
  }
  return <h1>Your email has been verified</h1>;
};

export default VerifyEmail;
