import {
    faChevronDown,
    faChevronRight,
    faFolder,
    faFolderOpen,
    faImage,
} from "@fortawesome/free-solid-svg-icons";
import {
    faCheckSquare,
    faSquare,
    faMinusSquare,
    faPlusSquare,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React, { useEffect, useRef } from "react";
import CheckboxTree, { OnCheckNode } from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { useDispatch, useSelector } from "react-redux";

import { resultInterface } from "../../../../models/Directory";

import RootState from "../../../../models/RootState";
import { directoriesActions } from "../../../../store/directories-slice";

const removeEmptyArrays = (data: resultInterface[]) => {
    for (const tree of data) {
        if (tree.children) {
            if (tree.children.length === 0) {
                delete tree.children;
            } else {
                removeEmptyArrays(tree.children);
            }
        }
    }
};

interface DirectoryViewerProps {
    expanded: string[];
    setExpanded: React.Dispatch<React.SetStateAction<string[]>>;
    onImageSelected: (targetNodeId:string) => void
}

const DirectoryViewer: React.FC<DirectoryViewerProps> = ({
    expanded,
    setExpanded,
    onImageSelected
}) => {
    const tree = useRef<CheckboxTree>(null);

    const directories = useSelector(
        (state: RootState) => state.directories.rootFolder
    );

    // Note: This only works because we do not expect any NULL or UNDEFINED or non-JSON values in the object.
    // There are much better ways of deep cloning an object, but this will do for now.
    const cleaned: resultInterface[] = JSON.parse(JSON.stringify(directories));
    removeEmptyArrays(cleaned);
    useEffect(() => {
        if (directories.length) {
            const newItemIndex = directories
                .map((imported) => imported.value)
                .slice(-1);
            setExpanded((prevState) => [newItemIndex.toString(), ...prevState]);

        }
    }, [directories, setExpanded]);

    const dispatch = useDispatch()
    const checkHandler = (checked: string[], targetNode: OnCheckNode) => {
        dispatch(directoriesActions.setChecked(checked))
    };

    const expandHandler = (expanded: string[]) => {
        setExpanded(expanded);
    };

    const clickHandler = (targetNode: OnCheckNode) => {
        onImageSelected(targetNode.value)
    };

    const checked = useSelector((state: RootState) => state.directories.checked)
    return (
        <CheckboxTree
            ref={tree}
            nodes={cleaned}
            checked={checked}
            expanded={expanded}
            onCheck={checkHandler}
            onExpand={expandHandler}
            onClick={clickHandler}
            iconsClass="fa5"
            showExpandAll={true}
            icons={{
                check: (
                    <FontAwesomeIcon
                        className="rct-icon rct-icon-check"
                        icon={faCheckSquare}
                    />
                ),
                uncheck: (
                    <FontAwesomeIcon
                        className="rct-icon rct-icon-uncheck"
                        icon={faSquare}
                    />
                ),
                halfCheck: (
                    <FontAwesomeIcon
                        className="rct-icon rct-icon-half-check"
                        icon={faMinusSquare}
                    />
                ),
                expandClose: (
                    <FontAwesomeIcon
                        className="rct-icon rct-icon-expand-close"
                        icon={faChevronRight}
                    />
                ),
                expandOpen: (
                    <FontAwesomeIcon
                        className="rct-icon rct-icon-expand-open"
                        icon={faChevronDown}
                    />
                ),
                expandAll: (
                    <FontAwesomeIcon
                        className="rct-icon rct-icon-expand-all"
                        icon={faPlusSquare}
                    />
                ),
                collapseAll: (
                    <FontAwesomeIcon
                        className="rct-icon rct-icon-collapse-all"
                        icon={faMinusSquare}
                    />
                ),
                parentClose: (
                    <FontAwesomeIcon
                        className="rct-icon rct-icon-parent-close text-gray-700"
                        icon={faFolder}
                    />
                ),
                parentOpen: (
                    <FontAwesomeIcon
                        className="rct-icon rct-icon-parent-open text-blue-700"
                        icon={faFolderOpen}
                    />
                ),
                leaf: (
                    <FontAwesomeIcon
                        className="rct-icon rct-icon-leaf-close text-gray-700"
                        icon={faImage}
                    />
                ),
            }}
        />
    );
};

export default DirectoryViewer;
