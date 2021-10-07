import {
    faCheckSquare,
    faChevronDown,
    faChevronRight,
    faFolder,
    faFolderOpen,
    faMinusSquare,
    faPlusSquare,
    faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useRef, useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { findDOMNode } from "react-dom";
import { useSelector } from "react-redux";

import { resultInterface } from "../../models/DirectoryStructure";

import RootState from "../../models/RootState";

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

const DirectoryViewer = () => {
    // const files = useSelector((state:RootState) => state.files)
    // console.log(files)

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
            console.log("Use effect running");
            const newItemIndex = directories
                .map((imported) => imported.value)
                .slice(-1);
            setExpanded((prevState) => [newItemIndex.toString(), ...prevState]);
            console.log(tree.current)
            const currentTree = findDOMNode(tree.current);
            // below line makes first node of the tree focused after the tree load
            // (tree.current?.firstChild?.firstChild as HTMLElement)
            //     ?.querySelector<HTMLElement>(".rct-node-clickable")
            //     ?.focus();
        }
    }, [directories]);

    const [checked, setChecked] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<string[]>([]);

    // Expand by default?
    // useEffect(() => {
    //     // setExpanded((prevState) => [...expandedDefault, ...prevState])
    //     setExpanded(expandedDefault)
    // }, [directories])

    console.log("first", checked);

    const checkHandler = (checked: string[]) => {
        setChecked(checked);
        console.log(checked);
    };

    const expandHandler = (expanded: string[]) => {
        setExpanded(expanded);
        console.log({ expanded });
    };
    return (
        <CheckboxTree
            ref={tree}
            nodes={cleaned}
            checked={checked}
            expanded={expanded}
            onCheck={checkHandler}
            onExpand={expandHandler}
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
                        className="rct-icon rct-icon-parent-close"
                        icon={faFolder}
                    />
                ),
                parentOpen: (
                    <FontAwesomeIcon
                        className="rct-icon rct-icon-parent-open"
                        icon={faFolderOpen}
                    />
                ),
                leaf: (
                    <FontAwesomeIcon
                        className="rct-icon rct-icon-leaf-close"
                        icon={faFolder}
                    />
                ),
            }}
        />
    );
};

export default DirectoryViewer;
