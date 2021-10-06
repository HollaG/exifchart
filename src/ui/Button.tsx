interface ButtonProps {
    size?: string,
    type?: string,
    onClick: () => void
}

const Button:React.FC<ButtonProps> = (props) => {
    return <button onClick={props.onClick} className="p-3 bg-green-600 hover:bg-green-800 text-white rounded-lg" > {props.children} </button>
}

export default Button