import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { polygonId } = req.query;

  try {
    const response = await axios.get(
      `https://07f3-34-125-159-52.ngrok-free.app/predict/${polygonId}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        message: error.message,
        code: error.code,
        response: error.response
          ? {
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data,
            }
          : null,
        request: error.request,
      });
    } else {
      console.error("Unexpected error:", error);
    }

    res.status(500).json({ message: "Error fetching data from Flask server" });
  }
};

export default handler;
