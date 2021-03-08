import * as tfnode from '@tensorflow/tfjs-node'
import { LayersModel } from '@tensorflow/tfjs';
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import formidable from 'formidable'


let model: LayersModel;


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!model) {
        const dirRelativeToPublicFolder = 'model.json'

        const dir = path.resolve('./public', dirRelativeToPublicFolder);

        const filenames = fs.readdirSync(dir);
        const images = filenames.map(name => path.join('/', dirRelativeToPublicFolder, name))
        await tfnode.loadLayersModel('http://localhost:3031' + images.pop(),)
            .then(res => {
                model = res
            })
    }
    const data = await new Promise(function (resolve: (value: {
        fields: formidable.Fields,
        files: formidable.Files
    }) => void, reject) {
        const form = new formidable.IncomingForm({ keepExtensions: true });
        form.parse(req, function (err, fields, files) {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });
    const f = data.files.image as any

    if (!f?.path) {
        res.send('no-op')
    } else {
        try {
            const imageBuffer = fs.readFileSync(f.path);

            const tfimage = tfnode.node
                .decodePng(imageBuffer)
                .resizeNearestNeighbor([150, 150])
            const ww = await tfimage.flatten().array()
            const www = model.predict(tfnode.tensor4d([...ww], [1, 150, 150, 3]), {
                verbose: true
            })


            res.status(200).json({
                data: JSON.parse(www.toString().replace('Tensor\n', "").replace(",", "").trim()).pop().pop()
            })
        } catch (error) {
            res.json({
                data: -1
            })
        }
    }
}
export const config = {
    api: {
        bodyParser: false,
    },
}

export default handler