import dbConnect from "../../../db/connect";
import Place from "../../../db/models/Place";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);
  await dbConnect();

  const token = await getToken({ req: request });
  const userId = token.sub;

  if (request.method === "GET") {
    if (session) {
      const places = await Place.find({ owner: userId });
      return response.status(200).json(places);
    } else {
      const places = await Place.find({ owner: "default" });
      return response.status(200).json(places);
    }
  } else if (request.method === "POST") {
    try {
      if (session) {
        const placeData = request.body;
        await Place.create({ ...placeData, owner: userId });
        response.status(201).json({ status: "Place created" });
      } else {
        response.status(401).json({ status: "Not authorized" });
      }
    } catch (error) {
      console.error(error);
      response.status(400).json({ error: error.message });
    }
  } else {
    return response.status(405).json({ message: "Method not allowed" });
  }
}
