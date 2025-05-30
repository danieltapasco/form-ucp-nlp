import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { gender, message, socialNetworkId, gold } = req.body;

  try {
    //Ajustes
    // Crear mensaje
    const nuevoMensaje = await prisma.message.create({
      data: {
        gender,
        message,
        gold: gold,
        social_network_id: parseInt(socialNetworkId),
      },
    });

    res.status(200).json(nuevoMensaje);
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    res.status(500).json({ error: 'Error al guardar el mensaje' });
  }
}