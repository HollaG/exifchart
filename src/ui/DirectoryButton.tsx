interface ButtonProps {
    size?: string,
    type?: string,
    color?: string,
    hoverColor?: string,
    extraClasses?: string,
    buttonProps?: {
        [key:string]: string
    }
    onClick: () => void
}

const DirectoryButton:React.FC<ButtonProps> = (props) => {
    let defaultColor = "bg-gray-200"
    let defaultHoverColor = "hover:bg-gray-300"
    return <button {...props.buttonProps} onClick={props.onClick} className={`px-3 py-2 rounded-lg ${defaultColor} ${defaultHoverColor}`} > {props.children} </button>
}

export default DirectoryButton