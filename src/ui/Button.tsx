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

const Button:React.FC<ButtonProps> = (props) => {
    let defaultColor = "bg-green-600"
    let defaultHoverColor = "hover:bg-green-800"
    return <button {...props.buttonProps} onClick={props.onClick} className={`px-3 py-2 text-white rounded-lg ${props.color || defaultColor} ${props.hoverColor || defaultHoverColor} ${props.extraClasses && props.extraClasses}`} > {props.children} </button>
}

export default Button