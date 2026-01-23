import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";

async function verifyIdToken(req: Request, res: Response, next: NextFunction) {
  const { idToken, fcmToken } = req.body;
  console.log("ID token received...");

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      body: JSON.stringify({
        requestUri: `http://10.50.0.50:6000${req.originalUrl}`,
        postBody: `id_token=${idToken}&providerId=google.com`,
        returnSecureToken: true,
      }),
    }
  );

  const data: any = await response.json();
  const { idToken: firebaseIdToken } = data;

  getAuth()
    .verifyIdToken(firebaseIdToken)
    .then((decodedToken) => {
      res.locals.playerEmail = decodedToken.email;
      res.locals.fcmToken = fcmToken;
      next();
    })
    .catch((error) => {
      console.log(`Failed validating the ID token: ${error.message}`);
      return res.status(500).send({
        status: "FAILED",
        data: { error: error.message },
      });
    });
}

const middleware = {
  verifyIdToken,
};

export default middleware;
