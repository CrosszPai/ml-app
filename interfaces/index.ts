// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//

export interface Result {
    prop: string
    name: string
}
export interface predictResponse {
    data: Array<Result> | -1
}