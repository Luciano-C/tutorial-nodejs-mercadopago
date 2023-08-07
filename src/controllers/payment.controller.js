import mercadopago from "mercadopago"
import { MERCADOPAGO_TOKEN } from "../config.js";



export const createOrder = async (req, res) => {
  mercadopago.configure({
    access_token: MERCADOPAGO_TOKEN,
  });

  try {
    const result = await mercadopago.preferences.create({
      items: [
        {
            title: "Naranja Kg",
            unit_price: 500,
            // ctrl + espacio para ver opciones de moneda
            currency_id: "CLP",
            quantity: 1
        }
    ],
      notification_url: "https://658b-2800-150-11f-910-4e7-c62f-7d5-8a69.ngrok.io/webhook",
      back_urls: {
        success: "http://localhost:4000/success",
        // pending: "https://e720-190-237-16-208.sa.ngrok.io/pending",
        // failure: "https://e720-190-237-16-208.sa.ngrok.io/failure",
      },
    });

    console.log(result);

    // res.json({ message: "Payment creted" });
    res.json(result.body);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};



export const receiveWebhook = async (req, res) => {
  console.log('hola hook')  
  try {
      const payment = req.query;
      console.log(payment);
      if (payment.type === "payment") {
        const data = await mercadopago.payment.findById(payment["data.id"]);
        console.log(data);
      }
  
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };