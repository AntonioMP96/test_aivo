"use server"

import { GoogleGenAI, Type } from "@google/genai";


interface JsonResponse { // tipado del json
  date: string;
  description: string;
  injuries: boolean;
  location: string;
  owner: boolean;
  complete: boolean;
  question: string;
}

interface ResponseItem { // tipado de la respuesta de la IA
  readable: string;
  jsonresponse: JsonResponse;
}

interface Props {
    userQuestion: string,
    clientTime: string
    followUpAnswer?: string,
    followUpData?: Array<{
        id: string
        question: string
        answer: string
        jsonResponse: string
        timestamp: number
    }>
}

export const getAIResponse = async({ userQuestion, clientTime, followUpAnswer, followUpData }: Props): 
Promise<{ok: boolean, response?: ResponseItem, message?: string}> => {
    try {
        
        const ai = new GoogleGenAI({}); // instanciando AI

        // obteniendo respuesta:
        const airesponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents:
            `1.  Genera una respuesta amigable, concisa y legible que confirme la recepción de la información y haga un breve resumen. 
            2.  Extrae los siguientes datos del texto proporcionado y devuélvelos en formato JSON. 
            Si algún campo no se puede determinar, usa un valor nulo para el JSON. 
            Infiere todos los datos posibles solo por el contexto del texto que manda el usuario, 
            la locación puede ser una descripción relativa de dónde sucedió el acontecimiento, 
            por ejemplo el domicilio/casa del usuario o la casa de X persona, y en cuanto a la fecha, 
            si el usuario habla en presente, usa la fecha actual, si es una fecha relativa por ejemplo, ayer, calcula la fecha, 
            para tu referencia, la fecha actual en la que se encuentra el usuario es: ${clientTime}.
            si el usuario habla en primera persona del singular, entonces el es el owner, si habla en primera persona del plural o si se incluye en los 
            acontecimientos, entonces el tambien figura como el owner pues está involucrado en el incidente,
            si no hay suficiente información para completar los datos, setea 'complete' en false y haz una pregunta para obtener la información faltante.
            Formato JSON requerido (el orden de los parámetros debe ser estrictamente de esta forma):
            {
                "date": "yyyy-mm-dd",
                "location": "Lugar del suceso",
                "description": "Descripción en una sola oración",
                "injuries": true | false,
                "owner": true | false,
                "complete": true | false,
                "question": "Pregunta para el usuario si es necesario"
            }
            El texto del usuario es:
            "${ userQuestion }" 
            ${ followUpAnswer ? 'Este es un dato extra que envía el usuario:' + followUpAnswer + ', úsala para complementar la información.' : '' }
            ${ followUpData ? 
                'Y aquí hay un arreglo de JSONs con datos previamente recopilados sobre el mismo incidente que recibe el usuario:' + JSON.stringify(followUpData) + ', úsalos para complementar la pregunta del usuario.' 
                : '' 
            }`, 
            config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                type: Type.OBJECT,
                properties: {
                    readable: {
                    type: Type.STRING,
                    },
                    jsonresponse: {
                    type: Type.OBJECT,
                    properties: {
                        date:{ type:Type.STRING },
                        location:{ type: Type.STRING },
                        description:{ type: Type.STRING },
                        injuries:{ type: Type.BOOLEAN },
                        owner:{ type: Type.BOOLEAN },
                        complete: { type: Type.BOOLEAN },
                        question:{ type: Type.STRING }
                    },
                    },
                },
                propertyOrdering: ["readable", "jsonresponse"],
                },
            },
            },
        });
        
        if (!airesponse.text) {
            throw new Error('No se pudo obtener la respuesta de la IA');
        }
        const parsed: ResponseItem[] = JSON.parse(airesponse.text); // leyendo correctamente el texto como JSON
        const readable = parsed[0].readable; // texto legible
        const jsonresponse = parsed[0].jsonresponse; // respuesta en formato JSON

        if (!readable || !jsonresponse) {
            throw new Error('No se pudo obtener la respuesta de la IA')
        }

        if (!(
            jsonresponse !== null &&
            typeof jsonresponse === 'object' &&
            typeof jsonresponse.date === 'string' &&
            typeof jsonresponse.description === 'string' &&
            typeof jsonresponse.injuries === 'boolean' &&
            typeof jsonresponse.location === 'string' &&
            typeof jsonresponse.owner === 'boolean' &&
            typeof jsonresponse.complete === 'boolean' &&
            typeof jsonresponse.question === 'string'
        )) {
            throw new Error('El JSON obtenido no cumple el formato especificado')
        }
        
        const response = {
            readable,
            jsonresponse
        }

        return {
            ok: true,
            response,
        }

    } catch (error) {
        console.log('ERROR getting AI response', error)
        let message = "Error obteniendo respuesta"
        if (error instanceof Error && error.message) {
            message = error.message
        }
        return {
            ok: false,
            message
        }
    }
}