import { clear } from "idb-keyval"

const firstLoad = () => {
    console.log("Page load!")
    clear()
}   

export default firstLoad