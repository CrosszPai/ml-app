import * as tfnode from '@tensorflow/tfjs-node'
import { LayersModel } from '@tensorflow/tfjs';
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import formidable from 'formidable'


let model: LayersModel;

function mapToClass(index: number): string {
    switch (index) {
        case 0:
            return 'Caraway'
        case 1:
            return 'Holy Basil'
        case 2:
            return 'Papermint'
        case 3:
            return 'Sweet Basil'
        default:
            return 'Unkown';
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!model) {
        const dirRelativeToPublicFolder = 'model'

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
        //@ts-ignore
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
                .resizeNearestNeighbor([224, 224])
            const ww = (await tfimage.flatten().array()).map((val: number) => {
                return -1 + ((1 - (-1)) / (255 - 0)) * (val - 0)
            })
            //@ts-ignore
            const www = await model.predict(tfnode.tensor4d([...ww], [1, 224, 224, 3]), {
                verbose: true,
            }).flatten().array()

            res.status(200).json({
                data: www.map((val: number, index: number) => {
                    return {
                        prop: (val * 100).toFixed(0),
                        name: mapToClass(index)
                    }
                })
            })
        } catch (error) {
            console.log(error);
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