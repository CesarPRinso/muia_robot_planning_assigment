import { Point } from "./point"

export class Heap {
    private data: Array<any>
    private scoreFunction: any

    constructor(scoreFunction: any)  {
        this.data = []
        this.scoreFunction = scoreFunction
    }

    private bubbleUp(n: number) {
        const element = this.data[n]
        const score = this.scoreFunction(element)

        while (n > 0) {
            const parentN = Math.floor((n + 1) / 2) - 1
            const parent = this.data[parentN]

            if (score >= this.scoreFunction(parent)) {
                break
            }

            this.data[parentN] = element
            this.data[n] = parent
            n = parentN
        }
    }

    private sinkDown(n: number) {
        const length = this.data.length
        const element = this.data[n]
        const elemScore = this.scoreFunction(element)

        while (true) {
            const child2N = (n + 1) * 2
            const child1N = child2N - 1
            let swap = null
            let child1Score

            if (child1N < length) {
                const child1 = this.data[child1N]
                child1Score = this.scoreFunction(child1)

                if (child1Score < elemScore) {
                    swap = child1N
                }
            }

            if (child2N < length) {
                const child2 = this.data[child2N]
                const child2Score = this.scoreFunction(child2)
                if (child1Score) {
                    if (child2Score < (swap === null ? elemScore : child1Score)) {
                        swap = child2N
                    }
                }


            }

            if (swap === null) {
                break
            }

            this.data[n] = this.data[swap]
            this.data[swap] = element
            n = swap
        }
    }


    push(element: Point) {
        this.data.push(element)
        this.bubbleUp(this.data.length - 1)
    }

    pop(): Point {

        const top = this.data[0]
        const bottom = this.data.pop()
        const result = top ? top : bottom
        if (this.data.length > 0) {
            this.data[0] = result
            this.sinkDown(0)
        }
        return top
    }

    isEmpty():boolean{
        return this.data.length>0
    }

    size(): number {
        return this.data.length
    }
}