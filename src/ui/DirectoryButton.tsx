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
    let defaultColor = "bg-white"
    let defaultBorderColor = "border-gray-200"
    let defaultHoverColor = "hover:bg-gray-300"
    let defaultHoverBorderColor = "hover:border-gray-400"
    let focusState = "focus:ring-blue-500 focus:ring-1"
    return <button {...props.buttonProps} onClick={props.onClick} className={`px-3 py-2 rounded ${focusState} ${defaultColor} ${defaultHoverColor} ${defaultHoverBorderColor} ${defaultBorderColor} ${props.extraClasses && props.extraClasses}` } style={{borderWidth: '2px'}}> {props.children} </button>
}

export default DirectoryButton