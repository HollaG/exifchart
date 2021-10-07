export default interface DirectoryStructure { 
    rootFolder: resultInterface[],
    folderList: string[]

}
export interface resultInterface {
    value: string, label: string, children?: resultInterface[] 
 }


// {
//     root: {
//         "Guitar Test": {

//         },
//         "Photo Outings": {
//             "01_04_2021": {
//                 "Edited": 0
//             }
//         }
//     }
// }