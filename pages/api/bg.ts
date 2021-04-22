import { NextApiRequest, NextApiResponse } from "next";
import formidable from 'formidable'
import { removeBackgroundFromImageFile } from "remove.bg";
import { nanoid } from "nanoid";
import { env } from "../../config/env";
import fs from 'fs'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const data = await new Promise(function (resolve: (value: {
        fields: formidable.Fields,
        files: formidable.Files
    }) => void, reject) {
        //@ts-ignore
        const form = new formidable.IncomingForm({ keepExtensions: true });
        form.parse(req, function (err, fields, files) {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });
    const f = data.files.image as any
    
    try {
        const result_path = `./storage/${nanoid()}.png`
        await removeBackgroundFromImageFile({
            path: f.path,
            apiKey: env.bgkey as string,
            bg_color: '#ffffff',
            outputFile: result_path
        })
        res.setHeader('Content-Type', 'image/jpg')
        res.send(fs.readFileSync(result_path))
    } catch (err) {
        console.log(err);
        res.send('error')
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
}

export default handler