import { useEffect } from 'react';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { useSelector } from 'react-redux';
import DirectoryDetails from '../models/DirectoryDetails';
import ImageDetails from '../models/ImageDetails';


interface RootState {
    files: ImageDetails[],
    directories: DirectoryDetails[]
}

const DirectoryViewer = () => {



    // const files = useSelector((state:RootState) => state.files)
    // console.log(files)

    const directories = useSelector((state: RootState) => state.directories)
    

    return <h1>{JSON.stringify(directories)}</h1>
}

export default DirectoryViewer