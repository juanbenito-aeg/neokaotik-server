import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";

async function verifyIdToken(req: Request, res: Response, next: NextFunction) {
  const { idToken, fcmToken } = req.body;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      body: JSON.stringify({
        requestUri: `https://neokaotik-server.onrender.com${req.originalUrl}`,
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
    .catch(() => {
      return res.status(500).send({
        status: "FAILED",
        data: { error: "The ID token is not valid or has expired." },
      });
    });
}

const middleware = {
  verifyIdToken,
};

export default middleware;
