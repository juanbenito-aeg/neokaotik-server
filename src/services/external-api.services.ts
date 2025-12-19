const getKaotikaPlayer = async (userEmail: string) => {
  try {
    console.log("Fetching user from Kaotika...");

    const response = await fetch(
      `https://kaotika-server.fly.dev/players/email/${userEmail}`
    );

    if (!response.ok) {
      throw new Error(`Kaotika API error: ${response.status}`);
    }

    const kaotikaPlayer: any = await response.json();
    const userData = kaotikaPlayer.data;
    return userData || null;
  } catch (error) {
    throw error;
  }
};

const externalApiService = {
  getKaotikaPlayer,
};

export default externalApiService;
