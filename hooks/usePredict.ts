import { useCallback, useEffect, useRef, useState } from "react"
import * as ts from '@tensorflow/tfjs'
import { predictResponse, Result } from "../interfaces"
import { isSafari, mapToClass } from "../utils"

type predicFunction = (method: 'local' | 'server', img: File | HTMLImageElement) => void

export function usePredict(): [{ result: Array<Result>, processing: boolean, clear: () => void, error: boolean }, predicFunction] {
    const model = useRef<ts.LayersModel>()
    const [result, setResult] = useState<Array<Result>>([])
    const [error, setError] = useState<boolean>(false)
    const [processing, setProcessing] = useState(false)
    const predict = useCallback((method: 'local' | 'server', img: File | HTMLImageElement) => {
        (async () => {
            if (!model.current) {
                model.current = await ts.loadLayersModel('/model/model.json')
            } else {
                console.log(img);
                console.log(method);

                if (method === "server") {
                    if (img) {
                        const form = new FormData();
                        form.append("image", img as File);
                        setProcessing(true);
                        setError(false);
                        fetch("/api/tensor", {
                            method: "POST",
                            body: form,
                        })
                            .then((res) => res.json() as Promise<predictResponse>)
                            .then((data) => {
                                if (data.data === -1) {
                                    setError(true);
                                } else {
                                    setResult(data.data);
                                }
                            })
                            .finally(() => {
                                setProcessing(false);
                            });
                    }
                }
                else {
                    setProcessing(true)
                    const tfimage: ts.Tensor = ts.browser.fromPixels(img as HTMLImageElement).resizeNearestNeighbor([224, 224])
                    const ww = (await tfimage.flatten().array()).map((val: number) => {
                        return -1 + ((1 - (-1)) / (255 - 0)) * (val - 0)
                    })
                    const www = await (model.current.predict(ts.tensor4d([...ww], [1, 224, 224, 3]), {
                        verbose: true,
                    }) as ts.Tensor).flatten().array()
                    setResult(www.map((val: number, index: number) => {
                        return {
                            prop: (val * 100).toFixed(0),
                            name: mapToClass(index)
                        }
                    }))
                    setProcessing(false)
                }
            }
        })()
    }, [])
    useEffect(() => {
        (async () => {
            const gl = document.createElement('canvas').getContext('webgl2');
            if (!gl) {
                if (!isSafari()) {
                    await import("@tensorflow/tfjs-backend-wasm")
                    ts.setBackend('wasm')
                } else {
                    ts.setBackend('cpu')
                }
            }
            await ts.ready()
            console.log(ts.getBackend());
            model.current = await ts.loadLayersModel('/model/model.json')
        })()
    }, [])
    const clear = useCallback(() => {
        setResult([])
        setError(false)
    }, [])
    return [
        {
            processing,
            result,
            clear,
            error
        },
        predict
    ]
}